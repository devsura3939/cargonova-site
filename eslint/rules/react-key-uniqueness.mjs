/**
 * Custom ESLint rule: react-key-uniqueness
 *
 * Catches duplicate React keys that can be proven statically. React itself
 * only warns at runtime ("Encountered two children with the same key"), so
 * this rule fails lint (and therefore the build) before that can ship.
 *
 * Two patterns are checked inside a single `<array>.map(cb)` call:
 *
 * 1. Statically-resolvable key values on the rendered JSX — e.g. two
 *    `key={t("trk.service")}` or `key="x"` in the same map body.
 *
 * 2. `key={item.<prop>}` where the array literal's object elements define
 *    `<prop>` with statically-equal values — e.g. two elements carrying
 *    `label: t("trk.service")` while the JSX keys off `item.label`.
 *
 * Dynamic values (function calls with non-literal args, identifiers, etc.)
 * are intentionally ignored — the rule only reports what it can prove.
 */
const STATIC_WRAPPERS = new Set(["TSAsExpression", "TSTypeAssertion", "ParenthesizedExpression", "TypeCastExpression"]);

/** Unwrap TS/paren wrappers and return the resolved expression. */
function unwrap(node) {
  let n = node;
  while (n && STATIC_WRAPPERS.has(n.type)) n = n.expression;
  return n;
}

/**
 * Best-effort static value of an expression:
 * - string/number literals
 * - template literals without interpolation
 * - calls on a simple identifier with a string-literal first arg (e.g.
 *   `t("trk.service")`, `tPhrase("Van")`) — resolved to the literal arg
 * Returns null when the value cannot be known statically.
 */
function staticValue(node) {
  const n = unwrap(node);
  if (!n) return null;
  if (n.type === "Literal" && (typeof n.value === "string" || typeof n.value === "number")) {
    return String(n.value);
  }
  if (n.type === "TemplateLiteral" && n.expressions.length === 0 && n.quasis.length === 1) {
    return n.quasis[0].value.cooked;
  }
  if (n.type === "CallExpression" && n.callee.type === "Identifier") {
    const first = n.arguments && n.arguments[0];
    if (first && first.type === "Literal" && typeof first.value === "string") {
      return first.value;
    }
  }
  return null;
}

/** If the expression is `param.prop` or `param["prop"]`, return the prop name. */
function keyProp(expression, paramName) {
  const n = unwrap(expression);
  if (!n || n.type !== "MemberExpression") return null;
  if (n.object.type !== "Identifier" || n.object.name !== paramName) return null;
  if (!n.computed && n.property.type === "Identifier") return n.property.name;
  if (n.computed && n.property.type === "Literal" && typeof n.property.value === "string") {
    return n.property.value;
  }
  return null;
}

/** Collect every JSXElement node in a subtree (excluding the root itself). */
function collectJsxElements(node, out) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "JSXElement") out.push(node);
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) collectJsxElements(c, out);
    } else if (child && typeof child.type === "string") {
      collectJsxElements(child, out);
    }
  }
}

/**
 * Resolve the array feeding `.map()`: either an inline array literal
 * (`[...].map(...)`) or a variable initialized to an array literal
 * (`const items = [...]; items.map(...)`), following the scope chain.
 */
function resolveArraySource(context, callNode, source) {
  if (source.type === "ArrayExpression") return source;
  if (source.type === "Identifier") {
    let scope = context.sourceCode.getScope(callNode);
    while (scope) {
      const variable = scope.set.get(source.name);
      if (variable) {
        const def = variable.defs && variable.defs.find((d) => d.type === "Variable");
        if (def && def.node && def.node.init && def.node.init.type === "ArrayExpression") {
          return def.node.init;
        }
        return null; // name resolves, but not to an array literal — give up
      }
      scope = scope.upper;
    }
  }
  return null;
}

/** Read a `key` JSX attribute from an element, or null. */
function keyAttribute(jsxElement) {
  const attrs = jsxElement.openingElement.attributes;
  if (!Array.isArray(attrs)) return null;
  return attrs.find((a) => a.type === "JSXAttribute" && a.name && a.name.name === "key") ?? null;
}

/** Statically-evaluable value of the `prop` on an object literal element, or null. */
function objectPropValue(element, prop) {
  if (element.type !== "ObjectExpression") return null;
  for (const p of element.properties) {
    if (p.type !== "Property" && p.type !== "PropertyDefinition") continue;
    let name = null;
    if (p.key.type === "Identifier") name = p.key.name;
    else if (p.key.type === "Literal" && typeof p.key.value === "string") name = p.key.value;
    if (name === prop) return staticValue(p.value);
  }
  return null;
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Detect React keys that are provably duplicated within a single map, preventing duplicate-key runtime errors.",
      recommended: false,
    },
    messages: {
      duplicateKey: "Duplicate React key '{{key}}' produced by this map — keys must be unique.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== "MemberExpression") return;
        if (node.callee.property.type !== "Identifier" || node.callee.property.name !== "map") return;
        const source = node.callee.object;
        const arraySource = resolveArraySource(context, node, source);
        if (!arraySource) return;
        const callback = node.arguments[0];
        if (!callback || (callback.type !== "ArrowFunctionExpression" && callback.type !== "FunctionExpression")) return;
        const param = callback.params[0];
        const paramName = param && param.type === "Identifier" ? param.name : null;

        const body = callback.body;
        const jsxElements = [];
        collectJsxElements(body, jsxElements);

        // Statically-resolvable keys seen so far (value -> node) for pattern 1.
        const seenGeneric = new Map();
        // Props already resolved against the array for pattern 2.
        const processedProps = new Set();
        const elements = arraySource.elements ?? [];

        for (const el of jsxElements) {
          const attr = keyAttribute(el);
          if (!attr) continue;
          const value = attr.value;
          const expression = value && value.type === "JSXExpressionContainer" ? value.expression : value;

          // Pattern 2: key={param.prop} resolved against the array elements.
          if (paramName) {
            const prop = keyProp(expression, paramName);
            if (prop) {
              if (processedProps.has(prop)) continue;
              processedProps.add(prop);
              const counts = new Map();
              for (const element of elements) {
                const resolved = objectPropValue(element, prop);
                if (resolved !== null) {
                  counts.set(resolved, (counts.get(resolved) ?? 0) + 1);
                }
              }
              for (const [resolved, count] of counts) {
                if (count > 1) {
                  context.report({
                    node: attr,
                    messageId: "duplicateKey",
                    data: { key: resolved },
                  });
                }
              }
              continue;
            }
          }

          // Pattern 1: statically-resolvable key (literal, template, t("...")).
          const resolved = staticValue(expression);
          if (resolved !== null) {
            const prev = seenGeneric.get(resolved);
            const repeatsByLength =
              // The same element renders once per array item, so a static key
              // in a map over ≥2 definitively-known items is always duplicated.
              !arraySource.elements.some((e) => !e || e.type === "SpreadElement") &&
              arraySource.elements.filter(Boolean).length >= 2;
            if (prev || repeatsByLength) {
              context.report({
                node: attr,
                messageId: "duplicateKey",
                data: { key: resolved },
              });
              seenGeneric.set(resolved, null);
            } else {
              seenGeneric.set(resolved, attr);
            }
          }
        }
      },
    };
  },
};

export default rule;
