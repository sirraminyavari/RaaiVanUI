(function () {
    if (window.RVFormula) return;

    var get_operators = function () {
        return [
            { option: "+", type: "operator" },
            { option: "-", type: "operator" },
            { option: "*", type: "operator" },
            { option: "/", type: "operator" },
            { option: "(", type: "braces_open" },
            { option: ")", type: "braces_close" },
        ];
    };

    var get_functions = function () {
        return [
            { option: "isEmpty", type: "function", argsLength: 2 }
        ];
    };

    var parse_variables = variables =>
        (variables || []).reduce((pre, cur) => (pre[cur.Name] = cur.Label, pre), {});

    window.RVFormula = function (container, params) {
        this.Container = typeof (container) == "object" ? container : document.getElementById(container);
        if (!this.Container) return;
        params = params || {};

        this.Objects = {
            FormulaInput: null,
            Formula: [],
            CurrentOptions: [],
            IsValidFormula: true
        };

        this.Options = {
            InitialFormula: params.Formula,
            Variables: parse_variables(params.Variables || []) || {}
        };

        var that = this;

        GlobalUtilities.load_files([{ Root: "jQuery/selectize/", Childs: ["selectize.default.css", "selectize.js"] }], {
            OnLoad: () => that.preinit()
        });
    };

    RVFormula.prototype = {
        preinit: function () {
            var that = this;

            Selectize.define('function_arguments', function (options) {
                var functionArgsClass = function (thisRef) {
                    var self = thisRef;
                    var original = self.setup;

                    self.setup = function () {
                        var option_render = self.settings.render.option;
                        var item_render = self.settings.render.item;

                        /* -- manipulate the rendering of the options
                        self.settings.render.option = function (option) {
                            // "render" the original option to get the current HTML
                            var html = option_render.apply(self, arguments);
                            var $html = jQuery(html);
                            console.log(option, "ramin");
                            if (option.first_func_arg) $html.addClass("first-func-arg");
                            else if (option.last_func_arg) $html.addClass("last-func-arg");
                            console.log(jQuery('<div>').append($html.clone()).html(), "ramin 2");
                            // return NEW $html element as HTML string
                            return jQuery('<div>').append($html.clone()).html();
                        }
                        */

                        self.settings.render.item = function (option) {
                            // "render" the original item to get the current HTML
                            var html = item_render.apply(self, arguments);
                            var $html = jQuery(html);

                            var formula = self.items.map(value => self.options[value]);
                            
                            if (RVFormula.has_open_function(formula)) {
                                if (formula[formula.length - 1].type === "function")
                                    $html.addClass("selectize-first-func-arg");

                                if (!RVFormula.has_open_function(formula.concat([option])))
                                    $html.addClass("selectize-last-func-arg");
                            }
                            
                            // return NEW $html element as HTML string
                            return jQuery('<div>').append($html.clone()).html();
                        }

                        original.apply(self, arguments);
                    };
                };

                functionArgsClass(this, options);
            });

            that.initialize();
        },

        initialize: function () {
            var that = this;

            var initialFormula = RVFormula.parse_formula(that.Options.InitialFormula, that.Options.Variables);
            var initialOptions = (initialFormula || []).map(x => that.create_option(x));

            that.Objects.CurrentOptions = that.get_options().concat(initialOptions);

            var formulaInput = that.Objects.FormulaInput = jQuery(that.Container).selectize({
                delimiter: ",",
                items: initialOptions.map(x => x.value), //initial value
                options: that.Objects.CurrentOptions,
                valueField: "value",
                labelField: "option",
                persist: true,
                openOnFocus: true,
                closeAfterSelect: false,
                allowEmptyOption: false,
                plugins: ["function_arguments"],
                create: function (input) {
                    var isNumber = (input === "0") || (!isNaN(+input) && (+input > 0));
                    var foundOption = that.Objects.CurrentOptions.find(c => c.option == input);

                    if (!!foundOption) return that.create_option(foundOption);
                    else if (isNumber) {
                        var created = that.create_option({ option: input, type: "number" });
                        return that.is_valid_option(created) ? created : null;
                    }
                    else return null;
                },
                onChange: () => {
                    that.Objects.Formula = formulaInput.items.map(value => formulaInput.options[value]);

                    that.Objects.CurrentOptions
                        .filter(op => !formulaInput.items.some(i => i == op.value))
                        .forEach(op => formulaInput.removeOption(op.value));

                    Object.keys(formulaInput.options)
                        .filter(value => !formulaInput.items.some(i => i == value) &&
                            !that.Objects.CurrentOptions.some(i => i == value))
                        .forEach(value => formulaInput.removeOption(value));

                    that.Objects.CurrentOptions = that.get_options();
                    formulaInput.addOption(that.Objects.CurrentOptions);
                    formulaInput.refreshOptions();
                }
            })[0]?.selectize;
        },

        create_option: (op) => ({
            option: op.option,
            value: GlobalUtilities.random(1, 99999),
            type: op.type,
            variable: op.variable,
            argsLength: op.argsLength
        }),

        ends_with_operator: function () {
            var formula = this.Objects.Formula || [];
            return !formula.length || (formula[formula.length - 1].type === "operator");
        },

        ends_with_value: function () {
            var formula = this.Objects.Formula || [];
            return !!formula.length && this.is_value(formula[formula.length - 1]);
        },

        ends_with_braces_open: function () {
            var formula = this.Objects.Formula || [];
            return !!formula.length &&
                ["braces_open"].some(tp => formula[formula.length - 1].type === tp);
        },

        ends_with_braces_close: function () {
            var formula = this.Objects.Formula || [];
            return !!formula.length &&
                ["braces_close"].some(tp => formula[formula.length - 1].type === tp);
        },

        open_braces_count: function () {
            return (this.Objects.Formula || []).filter(op => op.type === "braces_open").length;
        },

        close_braces_count: function () {
            return (this.Objects.Formula || []).filter(op => op.type === "braces_close").length;
        },

        has_open_function: function (formula) {
            return RVFormula.has_open_function(formula || this.Objects.Formula || []);
        },

        is_value: (op) => ["variable", "number"].some(tp => op.type === tp),

        is_valid_option: function (op) {
            var that = this;
            
            if (op.type === "braces_open")
                return that.ends_with_operator() || that.ends_with_braces_open();
            else if (op.type === "braces_close")
                return (that.close_braces_count() < that.open_braces_count()) && !that.has_open_function() &&
                    (that.ends_with_value() || that.ends_with_braces_close());
            else if (that.is_value(op))
                return that.ends_with_braces_open() || that.ends_with_operator() || that.has_open_function();
            else if (op.type === "operator")
                return (that.ends_with_value() || that.ends_with_braces_close()) && !that.has_open_function();
            else if (op.type === "function")
                return (that.ends_with_braces_open() || that.ends_with_operator()) && !that.has_open_function();
            else return false;
        },

        is_valid_formula: function () {
            return !this.ends_with_operator() &&
                (this.open_braces_count() === this.close_braces_count()) &&
                !this.has_open_function();
        },

        get_options: function () {
            var that = this;

            return Object.keys(that.Options.Variables || {}).map(key => ({
                option: that.Options.Variables[key], type: "variable", variable: key
            }))
                .concat(get_operators())
                .concat(get_functions())
                .map(o => that.create_option(o))
                .filter(op => !!that.is_valid_option(op));
        },

        get_formula: function () {
            var that = this;

            return (that.Objects.Formula || []).length && !that.is_valid_formula() ? false :
                (that.Objects.Formula || []).map(f => (f.type == "variable" ? "[[" + f.variable + "]]" : f.option));
        }
    };

    RVFormula.has_open_function = function (formula) {
        formula = formula || [];
        var lastFuncIndex = formula.map(op => op.type).lastIndexOf("function");
        var lastFunc = lastFuncIndex >= 0 ? formula[lastFuncIndex] : null;

        return !!lastFunc && ((formula.length - lastFuncIndex - lastFunc.argsLength) <= 0);
    };

    RVFormula.parse_formula = function (formula, variables) {
        variables = variables || {};

        return (formula || " ")
            .trim()
            .split(" ")
            .filter(itm => !!itm)
            .map(itm => {
                var op = get_operators().find(x => x.option == itm);
                var func = get_functions().find(x => x.option === itm);

                if (!!op)
                    return op;
                else if (!!func)
                    return func;
                else if (/^\[\[[a-zA-Z0-9\-]+\]\]$/ig.test(itm)) {
                    //itm is variable
                    var key = itm.substring(2, itm.length - 2);
                    return { type: "variable", option: variables[key], variable: key };
                }
                else if (itm.length && !isNaN(+itm))
                    return { type: "number", option: itm };
                else return null;
            })
            .filter(itm => !!itm);
    };

    RVFormula.show_formula = function (container, formula, options) {
        options = options || {};

        var parts = RVFormula.parse_formula(formula, parse_variables(options.Variables || []));

        GlobalUtilities.create_nested_elements(parts.map(p => {
            var notFound = (p.option === null) || (p.option === undefined);

            return {
                Type: "div", Class: "rv-border-radius-quarter",
                Style: "display: inline-block; padding: 0.1rem 0.3rem; margin-left: 0.3rem; margin-bottom: 0.3rem;" +
                    "outline: 1px solid rgb(240, 240, 240); background-color: white; font-size: 0.7rem;" +
                    (notFound ? "color: red;" : ""),
                Childs: [{ Type: "text", TextValue: notFound ? RVDic.RemovedN.replace("[n]", RVDic.Variable) : p.option }]
            };
        }), container);
    };
})();