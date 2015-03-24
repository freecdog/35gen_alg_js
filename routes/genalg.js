/**
 * Created by yarvyk on 15.05.14.
 */

var GA;

GA = 'zaglushka';


GA = (function () {
    // private static
    var nextId = 0;

    // multi layers
    var ga_researchcenter_mode;
    var ga_researchcenter_value;

    // constructor
    var cls;
    cls = function (params) {
        // private
        var id = nextId++;

        // new 16.12.2010
        // new 2011.03.13 multi layers
        var ga_nums;
        var ga_layers_count;
        var ga_persons_count;
        var ga_diaps_start;
        var ga_diaps_finish;
        var ga_diaps;
        var ga_params;
        var ga_deltas;


        var ga_num;
        var ga_numcount;
        var ga_ds;
        var ga_df;
        var ga_diap;
        var ga_param;

        var ga_value;

        var ga_delta;
        var ga_diap_int64;

        var ga_cross_bytes_count;
        var ga_cross_type;
        var ga_mutation_percent;
        var ga_mutation_type;
        var ga_sort_percent;
        var ga_sort_type;

        var ga_current_function;
        var ga_functions_count;
        //private object []ga_functions;

        var rand = {};
        rand.Next = function (value) {
            // if value then (rand * value) else (rand);
            // return [0..value)
            return value ? Math.floor((value ? value : 1) * Math.random()) : Math.random();
        };

        var showoldtext = false;

        // private methods
        var GA_GetArrColumn = function (ga_arr, ga_arr_column, ga_arr_column_length) {
            var rec = new Array(ga_arr_column_length);
            var ga_i1;
            for (ga_i1 = 0; ga_i1 < ga_arr_column_length; ga_i1++) {
                rec[ga_i1] = ga_arr[ga_i1, ga_arr_column];
            }
            return rec;
        }
        var GA_ParamCalculation = function (ga_layer, ga_person) {
            return ga_nums[ga_layer][ga_person] * ga_deltas[ga_layer] + ga_diaps_start[ga_layer];
        }
        var GA_Functions = function (ga_f_params, ga_f_params_count) {
            var ga_ans = 0;
            var ga_i1;
            if (ga_current_function == 0) {   // sin(x)/x // -> max, 1 za 1 layer (t.e. -> k 10 za 10 layer)
                for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
                    ga_ans += Math.sin(ga_f_params[ga_i1]) / ga_f_params[ga_i1];
            }
            else if (ga_current_function == 1) {   // 1/exp // -> max, 1 za 1 layer
                for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++) {
                    var ga_f_value = ga_f_params[ga_i1];
                    ga_ans += (1.0 / (1 + (Math.exp((-Math.abs(ga_f_value))) * Math.sin((ga_f_value)) * Math.sin((ga_f_value)) * Math.cos((ga_f_value)) * Math.cos((ga_f_value)))));  // -4 .. 4
                }
            }
            else if (ga_current_function == 2) {   // RASTRIGIN // -> max, 110 za 1 layer
                for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
                    //ga_ans += 10 + ga_f_params[ga_i1] * ga_f_params[ga_i1] - 10 * Convert.ToDecimal(Math.Cos(2 * Math.PI * Convert.ToDouble(ga_f_params[ga_i1]))); //100 - (ga_f_params[ga_i1] * ga_f_params[ga_i1] - 10 * Convert.ToDecimal(Math.Cos(2 * Math.PI * Convert.ToDouble(ga_f_params[ga_i1]))));
                    ga_ans += 100.0 - ga_f_params[ga_i1] * ga_f_params[ga_i1] + 10.0 * (Math.cos(2 * Math.PI * (ga_f_params[ga_i1])));
            }
            else {   // Schwefel's (Sine Root) // diap ot -500 do 500, -> min ~~~ x=420, y=0
                for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
                    ga_ans += 418.9829 - ga_f_params[ga_i1] * (Math.sin(Math.sqrt(Math.abs(ga_f_params[ga_i1]))));
            }
            /*if (ga_current_function == 0)
             {  // Sum (xi*xi)
             for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
             //ga_rec += 1m / (ga_f_params[ga_i1] * ga_f_params[ga_i1]); // 1m, "m" = decimal
             ga_ans += (ga_f_params[ga_i1] * ga_f_params[ga_i1]);
             }
             else if (ga_current_function == 1)
             {  // Rastrigin = Sum (10 + xi*xi - 10*cos(2pi*x)
             for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
             {
             ga_ans += 10 + ga_f_params[ga_i1] * ga_f_params[ga_i1] - 10 * Convert.ToDecimal(Math.Cos(2 * Math.PI * Convert.ToDouble(ga_f_params[ga_i1]))); //100 - (ga_f_params[ga_i1] * ga_f_params[ga_i1] - 10 * Convert.ToDecimal(Math.Cos(2 * Math.PI * Convert.ToDouble(ga_f_params[ga_i1]))));
             }
             }
             else // if (ga_current_function == 2)
             {  // Schwefel's (Sine Root) = Sum ( 418.9829 - xi * sin (sqrt(abs(xi))) )
             for (ga_i1 = 0; ga_i1 < ga_f_params_count; ga_i1++)
             {
             ga_ans += (decimal)418.9829m - ga_f_params[ga_i1] * Convert.ToDecimal(Math.Sin(Math.Sqrt(Math.Abs((double)ga_f_params[ga_i1]))));
             }
             }*/

            return ga_ans;
        }
        var GA_Initializations = function () {
            var i1, i2;
            var ga_rec;

            ga_diap_int64 = ((1 << 31) >>> 0) - 1;
            ga_deltas = new Array(ga_layers_count);
            for (i1 = 0; i1 < ga_layers_count; i1++) {
                ga_deltas[i1] = ga_diaps[i1] / ga_diap_int64;
            }
            ga_nums = new Array(ga_layers_count);
            for (i1 = 0; i1 < ga_layers_count; i1++) ga_nums[i1] = new Array(ga_persons_count);
            ga_params = new Array(ga_layers_count);
            for (i1 = 0; i1 < ga_layers_count; i1++) ga_params[i1] = new Array(ga_persons_count);
            ga_value = new Array(ga_persons_count);

            for (i2 = 0; i2 < ga_persons_count; i2++) {
                for (i1 = 0; i1 < ga_layers_count; i1++)  // generate persons in layer
                {
                    ga_nums[i1][i2] = rand.Next(16384); //Math.floor(Math.random() * 16384);
                    ga_nums[i1][i2] = ga_nums[i1, i2] << 8;  // FF000000 => 00FF0000 for int64 it's 8 bit shl (8bit=1byte)
                    ga_nums[i1][i2] += rand.Next(16384);
                    ga_nums[i1][i2] = ga_nums[i1, i2] << 8;
                    ga_nums[i1][i2] += rand.Next(16384);
                    ga_nums[i1][i2] = ga_nums[i1, i2] << 8;
                    ga_nums[i1][i2] += rand.Next(16384);
                    ga_params[i1][i2] = GA_ParamCalculation(i1, i2);
                }
                ga_rec = new Array(ga_persons_count);
                ga_rec = GA_GetArrColumn(ga_params, i2, ga_layers_count);
                ga_value[i2] = GA_Functions(ga_rec, ga_layers_count);
            }
            //MessageBox.Show("asd");
        }

        // public (this instance only)
        this.get_id = function () {
            return id;
        };

        this.GA_GetCurrentFunction = function () {
            return ga_current_function;
        }
        this.GA_SetFunctionsCount = function (Count) {
            ga_functions_count = Count;
        }
        this.GA_SetCurrentFunction = function (ga_SCF_ulong) {
            if (ga_SCF_ulong < ga_functions_count) ga_current_function = ga_SCF_ulong;
            else ga_current_function = 0;
        }
        this.GA_SetResearchCenterMode = function (GA_SRCM) {
            ga_researchcenter_mode = GA_SRCM;
        }
        this.GA_SetResearchCenterValue = function (GA_SRCV) {
            ga_researchcenter_value = GA_SRCV;
        }


        this.get_name = function () {
            return name;
        };
        this.set_name = function (value) {
            if (typeof value != 'string')
                throw 'Name must be a string';
            if (value.length < 2 || value.length > 20)
                throw 'Name must be 2-20 characters long.';
            name = value;
        };

        // constructor accept params (in bottom of class because could be mistakes with functions that used in)
        if (params) {
            var ga_i1;
            var ga_rec1;

            ga_layers_count = params.ga_layers_count;
            ga_persons_count = params.ga_persons_count;

            ga_diaps_start = new Array(ga_layers_count);
            ga_diaps_finish = new Array(ga_layers_count);
            ga_diaps_start = params.ga_diaps_start.slice(0);
            ga_diaps_finish = params.ga_diaps_finish.slice(0);
            ga_diaps = new Array(ga_layers_count);
            for (ga_i1 = 0; ga_i1 < ga_layers_count; ga_i1++) {
                if (ga_diaps_start[ga_i1] < ga_diaps_finish[ga_i1]) {
                    ga_diaps[ga_i1] = ga_diaps_finish[ga_i1] - ga_diaps_start[ga_i1];
                }
                else {
                    ga_rec1 = ga_diaps_finish[ga_i1];
                    ga_diaps_finish[ga_i1] = ga_diaps_start[ga_i1];
                    ga_diaps_start[ga_i1] = ga_rec1;
                    ga_diaps[ga_i1] = ga_diaps_finish[ga_i1] - ga_diaps_start[ga_i1];
                }
            }

            ga_mutation_percent = params.ga_mutation_percent;
            ga_mutation_type = params.ga_mutation_type;
            ga_sort_percent = params.ga_sort_percent;
            ga_sort_type = params.ga_sort_type;

            this.GA_SetResearchCenterMode(params.ga_researchcenter_mode);
            this.GA_SetResearchCenterValue(params.ga_researchcenter_value);

            this.GA_SetFunctionsCount(params.ga_func_count);
            this.GA_SetCurrentFunction(params.ga_current_function);

            GA_Initializations();
        } else {
            console.log("no params");
        }

    };

    // public static
    cls.get_nextId = function () {
        return nextId;
    };

    // public (shared across instances)
    cls.prototype = {
        about: function(){
            console.log("ga by _jaric");
        },
        announce: function () {
            console.log('Hi there! My id is ' + this.get_id() + ' and my name is "' + this.get_name() + '"!\r\n' +
                'The next fellow\'s id will be ' + GA.get_nextId() + '!');
        }
    };

    return cls;
})();

exports.GA = GA;

