"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EventEmitter = require('events');

var fs = require('fs');

var _require = require('path'),
    resolve = _require.resolve,
    join = _require.join;

var combineErrors = require('combine-errors');

var cron = require('cron-validate');

var debug = require('debug')('bree');

var humanInterval = require('human-interval');

var isSANB = require('is-string-and-not-blank');

var isValidPath = require('is-valid-path');

var later = require('@breejs/later');

var ms = require('ms');

var threads = require('bthreads/process');

var _require2 = require('boolean'),
    boolean = _require2.boolean;

var _require3 = require('safe-timers'),
    setTimeout = _require3.setTimeout,
    setInterval = _require3.setInterval; // bthreads requires us to do this for web workers (see bthreads docs for insight)


threads.Buffer = Buffer; // instead of `threads.browser` checks below, we previously used this boolean
// const hasFsStatSync = typeof fs === 'object' && typeof fs.statSync === 'function';

var Bree = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2.default)(Bree, _EventEmitter);

  var _super = _createSuper(Bree);

  function Bree(config) {
    var _this;

    (0, _classCallCheck2.default)(this, Bree);
    _this = _super.call(this);
    _this.config = _objectSpread({
      // we recommend using Cabin for logging
      // <https://cabinjs.com>
      logger: console,
      // set this to `false` to prevent requiring a root directory of jobs
      // (e.g. if your jobs are not all in one directory)
      root: threads.browser ?
      /* istanbul ignore next */
      threads.resolve('jobs') : resolve('jobs'),
      // default timeout for jobs
      // (set this to `false` if you do not wish for a default timeout to be set)
      timeout: 0,
      // default interval for jobs
      // (set this to `0` for no interval, and > 0 for a default interval to be set)
      interval: 0,
      // this is an Array of your job definitions (see README for examples)
      jobs: [],
      // <https://breejs.github.io/later/parsers.html#cron>
      // (can be overridden on a job basis with same prop name)
      hasSeconds: false,
      // <https://github.com/Airfooox/cron-validate>
      cronValidate: {},
      // if you set a value > 0 here, then it will terminate workers after this time (ms)
      closeWorkerAfterMs: 0,
      // could also be mjs if desired
      // (this is the default extension if you just specify a job's name without ".js" or ".mjs")
      defaultExtension: 'js',
      // default worker options to pass to ~`new Worker`~ `new threads.Worker`
      // (can be overridden on a per job basis)
      // <https://nodejs.org/api/worker_threads.html#worker_threads_new_worker_filename_options>
      worker: {},
      //
      // if you set this to `true`, then a second arg is passed to log output
      // and it will be an Object with `{ worker: Object }` set, for example:
      // (see the documentation at <https://nodejs.org/api/worker_threads.html> for more insight)
      //
      // logger.info('...', {
      //   worker: {
      //     isMainThread: Boolean
      //     resourceLimits: Object,
      //     threadId: String
      //   }
      // });
      //
      outputWorkerMetadata: false
    }, config); //
    // if `hasSeconds` is `true` then ensure that
    // `cronValidate` object has `override` object with `useSeconds` set to `true`
    // <https://github.com/breejs/bree/issues/7>
    //

    if (_this.config.hasSeconds) _this.config.cronValidate = _objectSpread(_objectSpread({}, _this.config.cronValidate), {}, {
      preset: _this.config.cronValidate && _this.config.cronValidate.preset ? _this.config.cronValidate.preset : 'default',
      override: _objectSpread(_objectSpread({}, _this.config.cronValidate && _this.config.cronValidate.override ? _this.config.cronValidate.override : {}), {}, {
        useSeconds: true
      })
    });
    debug('config', _this.config);
    _this.closeWorkerAfterMs = {};
    _this.workers = {};
    _this.timeouts = {};
    _this.intervals = {};
    _this.validateJob = _this.validateJob.bind((0, _assertThisInitialized2.default)(_this));
    _this.getWorkerMetadata = _this.getWorkerMetadata.bind((0, _assertThisInitialized2.default)(_this));
    _this.run = _this.run.bind((0, _assertThisInitialized2.default)(_this));
    _this.start = _this.start.bind((0, _assertThisInitialized2.default)(_this));
    _this.stop = _this.stop.bind((0, _assertThisInitialized2.default)(_this));
    _this.add = _this.add.bind((0, _assertThisInitialized2.default)(_this));
    _this.remove = _this.remove.bind((0, _assertThisInitialized2.default)(_this)); // validate root (sync check)

    if (isSANB(_this.config.root)) {
      /* istanbul ignore next */
      if (!threads.browser && isValidPath(_this.config.root)) {
        var stats = fs.statSync(_this.config.root);
        if (!stats.isDirectory()) throw new Error("Root directory of ".concat(_this.config.root, " does not exist"));
      }
    } // validate timeout


    _this.config.timeout = _this.parseValue(_this.config.timeout);
    debug('timeout', _this.config.timeout); // validate interval

    _this.config.interval = _this.parseValue(_this.config.interval);
    debug('interval', _this.config.interval); //
    // if `this.config.jobs` is an empty array
    // then we should try to load `jobs/index.js`
    //

    if (_this.config.root && (!Array.isArray(_this.config.jobs) || _this.config.jobs.length === 0)) {
      try {
        _this.config.jobs = threads.require(_this.config.root);
      } catch (err) {
        _this.config.logger.error(err);
      }
    } //
    // validate jobs
    //


    if (!Array.isArray(_this.config.jobs)) throw new Error('Jobs must be an Array'); // provide human-friendly errors for complex configurations

    var errors = [];
    /*
    jobs = [
      'name',
      { name: 'boot' },
      { name: 'timeout', timeout: ms('3s') },
      { name: 'cron', cron: '* * * * *' },
      { name: 'cron with timeout', timeout: '3s', cron: '* * * * *' },
      { name: 'interval', interval: ms('4s') }
      { name: 'interval', path: '/some/path/to/script.js', interval: ms('4s') },
      { name: 'timeout', timeout: 'three minutes' },
      { name: 'interval', interval: 'one minute' },
      { name: 'timeout', timeout: '3s' },
      { name: 'interval', interval: '30d' },
      { name: 'schedule object', interval: { schedules: [] } }
    ]
    */

    for (var i = 0; i < _this.config.jobs.length; i++) {
      try {
        _this.config.jobs[i] = _this.validateJob(_this.config.jobs[i], i);
      } catch (err) {
        errors.push(err);
      }
    } // if there were any errors then throw them


    if (errors.length > 0) throw combineErrors(errors);
    debug('this.config.jobs', _this.config.jobs);
    return _this;
  }

  (0, _createClass2.default)(Bree, [{
    key: "getName",
    value: function getName(job) {
      if (isSANB(job)) return job;
      if ((0, _typeof2.default)(job) === 'object' && isSANB(job.name)) return job.name;
      if (typeof job === 'function' && isSANB(job.name)) return job.name;
    } // eslint-disable-next-line complexity

  }, {
    key: "validateJob",
    value: function validateJob(job, i) {
      var isAdd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var errors = [];
      var names = [];

      if (isAdd) {
        var name = this.getName(job);
        if (name) names.push(name);else errors.push(new Error("Job #".concat(i + 1, " is missing a name")));
      }

      for (var j = 0; j < this.config.jobs.length; j++) {
        var _name = this.getName(this.config.jobs[j]);

        if (!_name) {
          errors.push(new Error("Job #".concat(i + 1, " is missing a name")));
          continue;
        } // throw an error if duplicate job names


        if (names.includes(_name)) errors.push(new Error("Job #".concat(j + 1, " has a duplicate job name of ").concat(job)));
        names.push(_name);
      }

      if (errors.length > 0) throw combineErrors(errors); // support a simple string which we will transform to have a path

      if (isSANB(job)) {
        // don't allow a job to have the `index` file name
        if (['index', 'index.js', 'index.mjs'].includes(job)) throw new Error('You cannot use the reserved job name of "index", "index.js", nor "index.mjs"');

        if (!this.config.root) {
          errors.push(new Error("Job #".concat(i + 1, " \"").concat(job, "\" requires root directory option to auto-populate path")));
          throw combineErrors(errors);
        }

        var path = join(this.config.root, job.endsWith('.js') || job.endsWith('.mjs') ? job : "".concat(job, ".").concat(this.config.defaultExtension));
        /* istanbul ignore next */

        if (!threads.browser) {
          var stats = fs.statSync(path);
          if (!stats.isFile()) throw new Error("Job #".concat(i + 1, " \"").concat(job, "\" path missing: ").concat(path));
        }

        return {
          name: job,
          path: path,
          timeout: this.config.timeout,
          interval: this.config.interval
        };
      } // job is a function


      if (typeof job === 'function') {
        var _path = "(".concat(job.toString(), ")()"); // can't be a built-in or bound function


        if (_path.includes('[native code]')) errors.push(new Error("Job #".concat(i + 1, " can't be a bound or built-in function")));
        if (errors.length > 0) throw combineErrors(errors);
        return {
          name: job.name,
          path: _path,
          worker: {
            eval: true
          },
          timeout: this.config.timeout,
          interval: this.config.interval
        };
      } // use a prefix for errors


      var prefix = "Job #".concat(i + 1, " named \"").concat(job.name, "\"");

      if (typeof job.path === 'function') {
        var _path2 = "(".concat(job.path.toString(), ")()"); // can't be a built-in or bound function


        if (_path2.includes('[native code]')) errors.push(new Error("Job #".concat(i + 1, " can't be a bound or built-in function")));
        job.path = _path2;
        job.worker = _objectSpread({
          eval: true
        }, job.worker);
      } else if (!isSANB(job.path) && !this.config.root) {
        errors.push(new Error("".concat(prefix, " requires root directory option to auto-populate path")));
      } else {
        // validate path
        var _path3 = isSANB(job.path) ? job.path : join(this.config.root, job.name.endsWith('.js') || job.name.endsWith('.mjs') ? job.name : "".concat(job.name, ".").concat(this.config.defaultExtension));

        if (isValidPath(_path3)) {
          try {
            /* istanbul ignore next */
            if (!threads.browser) {
              var _stats = fs.statSync(_path3); // eslint-disable-next-line max-depth


              if (!_stats.isFile()) throw new Error("".concat(prefix, " path missing: ").concat(_path3));
            }

            if (!isSANB(job.path)) job.path = _path3;
          } catch (err) {
            errors.push(err);
          }
        } else {
          // assume that it's a transformed eval string
          job.worker = _objectSpread({
            eval: true
          }, job.worker);
        }
      } // don't allow users to mix interval AND cron


      if (typeof job.interval !== 'undefined' && typeof job.cron !== 'undefined') {
        errors.push(new Error("".concat(prefix, " cannot have both interval and cron configuration")));
      } // don't allow users to mix timeout AND date


      if (typeof job.timeout !== 'undefined' && typeof job.date !== 'undefined') errors.push(new Error("".concat(prefix, " cannot have both timeout and date"))); // don't allow a job to have the `index` file name

      if (['index', 'index.js', 'index.mjs'].includes(job.name)) {
        errors.push(new Error('You cannot use the reserved job name of "index", "index.js", nor "index.mjs"'));
        throw combineErrors(errors);
      } // validate date


      if (typeof job.date !== 'undefined' && !(job.date instanceof Date)) errors.push(new Error("".concat(prefix, " had an invalid Date of ").concat(job.date))); // validate timeout

      if (typeof job.timeout !== 'undefined') {
        try {
          job.timeout = this.parseValue(job.timeout);
        } catch (err) {
          errors.push(combineErrors([new Error("".concat(prefix, " had an invalid timeout of ").concat(job.timeout)), err]));
        }
      } // validate interval


      if (typeof job.interval !== 'undefined') {
        try {
          job.interval = this.parseValue(job.interval);
        } catch (err) {
          errors.push(combineErrors([new Error("".concat(prefix, " had an invalid interval of ").concat(job.interval)), err]));
        }
      } // validate hasSeconds


      if (typeof job.hasSeconds !== 'undefined' && typeof job.hasSeconds !== 'boolean') errors.push(new Error("".concat(prefix, " had hasSeconds value of ").concat(job.hasSeconds, " (it must be a Boolean)"))); // validate cronValidate

      if (typeof job.cronValidate !== 'undefined' && (0, _typeof2.default)(job.cronValidate) !== 'object') errors.push(new Error("".concat(prefix, " had cronValidate value set, but it must be an Object"))); // if `hasSeconds` was `true` then set `cronValidate` and inherit any existing options

      if (job.hasSeconds) {
        var preset = job.cronValidate && job.cronValidate.preset ? job.cronValidate.preset : this.config.cronValidate && this.config.cronValidate.preset ? this.config.cronValidate.preset : 'default';

        var override = _objectSpread(_objectSpread(_objectSpread({}, this.config.cronValidate && this.config.cronValidate.override ? this.config.cronValidate.override : {}), job.cronValidate && job.cronValidate.override ? job.cronValidate.override : {}), {}, {
          useSeconds: true
        });

        job.cronValidate = _objectSpread(_objectSpread(_objectSpread({}, this.config.cronValidate), job.cronValidate), {}, {
          preset: preset,
          override: override
        });
      } // validate cron


      if (typeof job.cron !== 'undefined') {
        if (this.isSchedule(job.cron)) {
          job.interval = job.cron; // delete job.cron;
        } else {
          //
          // validate cron pattern
          // (must support patterns such as `* * L * *` and `0 0/5 14 * * ?` (and aliases too)
          //
          //  <https://github.com/Airfooox/cron-validate/issues/67>
          //
          var result = cron(job.cron, typeof job.cronValidate === 'undefined' ? this.config.cronValidate : job.cronValidate);

          if (result.isValid()) {
            job.interval = later.parse.cron(job.cron, boolean(typeof job.hasSeconds === 'undefined' ? this.config.hasSeconds : job.hasSeconds)); // NOTE: it is always valid
            // const schedule = later.schedule(
            //   later.parse.cron(
            //     job.cron,
            //     boolean(
            //       typeof job.hasSeconds === 'undefined'
            //         ? this.config.hasSeconds
            //         : job.hasSeconds
            //     )
            //   )
            // );
            // if (schedule.isValid()) {
            //   job.interval = schedule;
            // } // else {
            //   errors.push(
            //     new Error(
            //       `${prefix} had an invalid cron schedule (see <https://crontab.guru> if you need help)`
            //     )
            //   );
            // }
          } else {
            var _iterator = _createForOfIteratorHelper(result.getError()),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var message = _step.value;
                errors.push(new Error("".concat(prefix, " had an invalid cron pattern: ").concat(message)));
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      } // validate closeWorkerAfterMs


      if (typeof job.closeWorkerAfterMs !== 'undefined' && (!Number.isFinite(job.closeWorkerAfterMs) || job.closeWorkerAfterMs <= 0)) errors.push(new Error("".concat(prefix, " had an invalid closeWorkersAfterMs value of ").concat(job.closeWorkersAfterMs, " (it must be a finite number > 0)")));
      if (errors.length > 0) throw combineErrors(errors); // if timeout was undefined, cron was undefined,
      // and date was undefined then set the default
      // (as long as the default timeout is >= 0)

      if (Number.isFinite(this.config.timeout) && this.config.timeout >= 0 && typeof job.timeout === 'undefined' && typeof job.cron === 'undefined' && typeof job.date === 'undefined') job.timeout = this.config.timeout; // if interval was undefined, cron was undefined,
      // and date was undefined then set the default
      // (as long as the default interval is > 0, or it was a schedule, or it was valid)

      if ((Number.isFinite(this.config.interval) && this.config.interval > 0 || this.isSchedule(this.config.interval)) && typeof job.interval === 'undefined' && typeof job.cron === 'undefined' && typeof job.date === 'undefined') job.interval = this.config.interval;
      return job;
    }
  }, {
    key: "getHumanToMs",
    value: function getHumanToMs(_value) {
      var value = humanInterval(_value);
      if (Number.isNaN(value)) return ms(_value);
      return value;
    }
  }, {
    key: "parseValue",
    value: function parseValue(value) {
      if (value === false) return value;
      if (this.isSchedule(value)) return value;

      if (isSANB(value)) {
        var schedule = later.schedule(later.parse.text(value));
        if (schedule.isValid()) return later.parse.text(value);
        value = this.getHumanToMs(value);
      }

      if (!Number.isFinite(value) || value < 0) throw new Error("Value ".concat(value, " must be a finite number >= 0 or a String parseable by `later.parse.text` (see <https://breejs.github.io/later/parsers.html#text> for examples)"));
      return value;
    }
  }, {
    key: "isSchedule",
    value: function isSchedule(value) {
      return (0, _typeof2.default)(value) === 'object' && Array.isArray(value.schedules);
    }
  }, {
    key: "getWorkerMetadata",
    value: function getWorkerMetadata(name) {
      var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var job = this.config.jobs.find(function (j) {
        return j.name === name;
      });
      if (!job) throw new Error("Job \"".concat(name, "\" does not exist"));
      if (!this.config.outputWorkerMetadata && !job.outputWorkerMetadata) return meta && (typeof meta.err !== 'undefined' || typeof meta.message !== 'undefined') ? meta : undefined;
      return this.workers[name] ? _objectSpread(_objectSpread({}, meta), {}, {
        worker: {
          isMainThread: this.workers[name].isMainThread,
          resourceLimits: this.workers[name].resourceLimits,
          threadId: this.workers[name].threadId
        }
      }) : meta;
    }
  }, {
    key: "run",
    value: function run(name) {
      var _this2 = this;

      debug('run', name);

      if (name) {
        var job = this.config.jobs.find(function (j) {
          return j.name === name;
        });
        if (!job) throw new Error("Job \"".concat(name, "\" does not exist"));
        if (this.workers[name]) return this.config.logger.warn(new Error("Job \"".concat(name, "\" is already running")), this.getWorkerMetadata(name));
        debug('starting worker', name);

        var object = _objectSpread(_objectSpread(_objectSpread({}, this.config.worker ? this.config.worker : {}), job.worker ? job.worker : {}), {}, {
          workerData: _objectSpread(_objectSpread({
            job: job
          }, this.config.worker && this.config.worker.workerData ? this.config.worker.workerData : {}), job.worker && job.worker.workerData ? job.worker.workerData : {})
        });

        this.workers[name] = new threads.Worker(job.path, object);
        this.emit('worker created', name);
        debug('worker started', name); // if we specified a value for `closeWorkerAfterMs`
        // then we need to terminate it after that execution time

        var closeWorkerAfterMs = Number.isFinite(job.closeWorkerAfterMs) ? job.closeWorkerAfterMs : this.config.closeWorkerAfterMs;

        if (Number.isFinite(closeWorkerAfterMs) && closeWorkerAfterMs > 0) {
          debug('worker has close set', name, closeWorkerAfterMs);
          this.closeWorkerAfterMs[name] = setTimeout(function () {
            if (_this2.workers[name]) {
              _this2.workers[name].terminate();
            }
          }, closeWorkerAfterMs);
        }

        var prefix = "Worker for job \"".concat(name, "\"");
        this.workers[name].on('online', function () {
          _this2.config.logger.info("".concat(prefix, " online"), _this2.getWorkerMetadata(name));
        });
        this.workers[name].on('message', function (message) {
          if (message === 'done') {
            _this2.config.logger.info("".concat(prefix, " signaled completion"), _this2.getWorkerMetadata(name));

            _this2.workers[name].removeAllListeners('message');

            _this2.workers[name].removeAllListeners('exit');

            _this2.workers[name].terminate();

            delete _this2.workers[name];
            return;
          }

          _this2.config.logger.info("".concat(prefix, " sent a message"), _this2.getWorkerMetadata(name, {
            message: message
          }));
        }); // NOTE: you cannot catch messageerror since it is a Node internal
        //       (if anyone has any idea how to catch this in tests let us know)

        /* istanbul ignore next */

        this.workers[name].on('messageerror', function (err) {
          _this2.config.logger.error("".concat(prefix, " had a message error"), _this2.getWorkerMetadata(name, {
            err: err
          }));
        });
        this.workers[name].on('error', function (err) {
          _this2.config.logger.error("".concat(prefix, " had an error"), _this2.getWorkerMetadata(name, {
            err: err
          }));
        });
        this.workers[name].on('exit', function (code) {
          _this2.config.logger[code === 0 ? 'info' : 'error']("".concat(prefix, " exited with code ").concat(code), _this2.getWorkerMetadata(name));

          delete _this2.workers[name];

          _this2.emit('worker deleted', name);
        });
        return;
      }

      var _iterator2 = _createForOfIteratorHelper(this.config.jobs),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _job = _step2.value;
          this.run(_job.name);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "start",
    value: function start(name) {
      var _this3 = this;

      debug('start', name);

      if (name) {
        var job = this.config.jobs.find(function (j) {
          return j.name === name;
        });
        if (!job) throw new Error("Job ".concat(name, " does not exist"));
        if (this.timeouts[name] || this.intervals[name]) return this.config.logger.warn(new Error("Job \"".concat(name, "\" is already started")));
        debug('job', job); // check for date and if it is in the past then don't run it

        if (job.date instanceof Date) {
          debug('job date', job);

          if (job.date.getTime() < Date.now()) {
            debug('job date was in the past');
            return;
          }

          this.timeouts[name] = setTimeout(function () {
            _this3.run(name);

            if (_this3.isSchedule(job.interval)) {
              debug('job.interval is schedule', job);
              _this3.intervals[name] = later.setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            } else if (Number.isFinite(job.interval) && job.interval > 0) {
              debug('job.interval is finite', job);
              _this3.intervals[name] = setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            }
          }, job.date.getTime() - Date.now());
          return;
        } // this is only complex because both timeout and interval can be a schedule


        if (this.isSchedule(job.timeout)) {
          debug('job timeout is schedule', job);
          this.timeouts[name] = later.setTimeout(function () {
            _this3.run(name);

            if (_this3.isSchedule(job.interval)) {
              debug('job.interval is schedule', job);
              _this3.intervals[name] = later.setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            } else if (Number.isFinite(job.interval) && job.interval > 0) {
              debug('job.interval is finite', job);
              _this3.intervals[name] = setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            }
          }, job.timeout);
          return;
        }

        if (Number.isFinite(job.timeout)) {
          debug('job timeout is finite', job);
          this.timeouts[name] = setTimeout(function () {
            _this3.run(name);

            if (_this3.isSchedule(job.interval)) {
              debug('job.interval is schedule', job);
              _this3.intervals[name] = later.setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            } else if (Number.isFinite(job.interval) && job.interval > 0) {
              debug('job.interval is finite', job.interval);
              _this3.intervals[name] = setInterval(function () {
                return _this3.run(name);
              }, job.interval);
            }
          }, job.timeout);
        } else if (this.isSchedule(job.interval)) {
          debug('job.interval is schedule', job);
          this.intervals[name] = later.setInterval(function () {
            return _this3.run(name);
          }, job.interval);
        } else if (Number.isFinite(job.interval) && job.interval > 0) {
          debug('job.interval is finite', job);
          this.intervals[name] = setInterval(function () {
            return _this3.run(name);
          }, job.interval);
        }

        return;
      }

      var _iterator3 = _createForOfIteratorHelper(this.config.jobs),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _job2 = _step3.value;
          this.start(_job2.name);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "stop",
    value: function stop(name) {
      var _this4 = this;

      if (name) {
        if (this.timeouts[name]) {
          if ((0, _typeof2.default)(this.timeouts[name]) === 'object' && typeof this.timeouts[name].clear === 'function') this.timeouts[name].clear();
          delete this.timeouts[name];
        }

        if (this.intervals[name]) {
          if ((0, _typeof2.default)(this.intervals[name]) === 'object' && typeof this.intervals[name].clear === 'function') this.intervals[name].clear();
          delete this.intervals[name];
        }

        if (this.workers[name]) {
          this.workers[name].once('message', function (message) {
            if (message === 'cancelled') {
              _this4.config.logger.info("Gracefully cancelled worker for job \"".concat(name, "\""), _this4.getWorkerMetadata(name));

              _this4.workers[name].terminate();

              delete _this4.workers[name];
            }
          });
          this.workers[name].postMessage('cancel');
        }

        if (this.closeWorkerAfterMs[name]) {
          if ((0, _typeof2.default)(this.closeWorkerAfterMs[name]) === 'object' && typeof this.closeWorkerAfterMs[name].clear === 'function') this.closeWorkerAfterMs[name].clear();
          delete this.closeWorkerAfterMs[name];
        }

        return;
      }

      var _iterator4 = _createForOfIteratorHelper(this.config.jobs),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var job = _step4.value;
          this.stop(job.name);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "add",
    value: function add(jobs) {
      //
      // make sure jobs is an array
      //
      if (!Array.isArray(jobs)) jobs = [jobs];
      var errors = [];

      var _iterator5 = _createForOfIteratorHelper(jobs.entries()),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = (0, _slicedToArray2.default)(_step5.value, 2),
              i = _step5$value[0],
              job_ = _step5$value[1];

          try {
            var job = this.validateJob(job_, i, true);
            this.config.jobs.push(job);
          } catch (err) {
            errors.push(err);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      debug('jobs added', this.config.jobs); // if there were any errors then throw them

      if (errors.length > 0) throw combineErrors(errors);
    }
  }, {
    key: "remove",
    value: function remove(name) {
      var job = this.config.jobs.find(function (j) {
        return j.name === name;
      });
      if (!job) throw new Error("Job \"".concat(name, "\" does not exist"));
      this.config.jobs = this.config.jobs.find(function (j) {
        return j.name !== name;
      }); // make sure it also closes any open workers

      this.stop(name);
    }
  }]);
  return Bree;
}(EventEmitter); // expose bthreads (useful for tests)
// https://github.com/chjj/bthreads#api


Bree.threads = {
  backend: threads.backend,
  browser: threads.browser,
  location: threads.location,
  filename: threads.filename,
  dirname: threads.dirname,
  require: threads.require,
  resolve: threads.resolve,
  exit: threads.exit,
  cores: threads.cores
};
module.exports = Bree;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJyZXF1aXJlIiwiZnMiLCJyZXNvbHZlIiwiam9pbiIsImNvbWJpbmVFcnJvcnMiLCJjcm9uIiwiZGVidWciLCJodW1hbkludGVydmFsIiwiaXNTQU5CIiwiaXNWYWxpZFBhdGgiLCJsYXRlciIsIm1zIiwidGhyZWFkcyIsImJvb2xlYW4iLCJzZXRUaW1lb3V0Iiwic2V0SW50ZXJ2YWwiLCJCdWZmZXIiLCJCcmVlIiwiY29uZmlnIiwibG9nZ2VyIiwiY29uc29sZSIsInJvb3QiLCJicm93c2VyIiwidGltZW91dCIsImludGVydmFsIiwiam9icyIsImhhc1NlY29uZHMiLCJjcm9uVmFsaWRhdGUiLCJjbG9zZVdvcmtlckFmdGVyTXMiLCJkZWZhdWx0RXh0ZW5zaW9uIiwid29ya2VyIiwib3V0cHV0V29ya2VyTWV0YWRhdGEiLCJwcmVzZXQiLCJvdmVycmlkZSIsInVzZVNlY29uZHMiLCJ3b3JrZXJzIiwidGltZW91dHMiLCJpbnRlcnZhbHMiLCJ2YWxpZGF0ZUpvYiIsImJpbmQiLCJnZXRXb3JrZXJNZXRhZGF0YSIsInJ1biIsInN0YXJ0Iiwic3RvcCIsImFkZCIsInJlbW92ZSIsInN0YXRzIiwic3RhdFN5bmMiLCJpc0RpcmVjdG9yeSIsIkVycm9yIiwicGFyc2VWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImVyciIsImVycm9yIiwiZXJyb3JzIiwiaSIsInB1c2giLCJqb2IiLCJuYW1lIiwiaXNBZGQiLCJuYW1lcyIsImdldE5hbWUiLCJqIiwiaW5jbHVkZXMiLCJwYXRoIiwiZW5kc1dpdGgiLCJpc0ZpbGUiLCJ0b1N0cmluZyIsImV2YWwiLCJwcmVmaXgiLCJkYXRlIiwiRGF0ZSIsImlzU2NoZWR1bGUiLCJyZXN1bHQiLCJpc1ZhbGlkIiwicGFyc2UiLCJnZXRFcnJvciIsIm1lc3NhZ2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImNsb3NlV29ya2Vyc0FmdGVyTXMiLCJfdmFsdWUiLCJ2YWx1ZSIsImlzTmFOIiwic2NoZWR1bGUiLCJ0ZXh0IiwiZ2V0SHVtYW5Ub01zIiwic2NoZWR1bGVzIiwibWV0YSIsImZpbmQiLCJ1bmRlZmluZWQiLCJpc01haW5UaHJlYWQiLCJyZXNvdXJjZUxpbWl0cyIsInRocmVhZElkIiwid2FybiIsIm9iamVjdCIsIndvcmtlckRhdGEiLCJXb3JrZXIiLCJlbWl0IiwidGVybWluYXRlIiwib24iLCJpbmZvIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwiY29kZSIsImdldFRpbWUiLCJub3ciLCJjbGVhciIsIm9uY2UiLCJwb3N0TWVzc2FnZSIsImVudHJpZXMiLCJqb2JfIiwiYmFja2VuZCIsImxvY2F0aW9uIiwiZmlsZW5hbWUiLCJkaXJuYW1lIiwiZXhpdCIsImNvcmVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUE1Qjs7QUFDQSxJQUFNQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxJQUFELENBQWxCOztlQUMwQkEsT0FBTyxDQUFDLE1BQUQsQztJQUF6QkUsTyxZQUFBQSxPO0lBQVNDLEksWUFBQUEsSTs7QUFFakIsSUFBTUMsYUFBYSxHQUFHSixPQUFPLENBQUMsZ0JBQUQsQ0FBN0I7O0FBQ0EsSUFBTUssSUFBSSxHQUFHTCxPQUFPLENBQUMsZUFBRCxDQUFwQjs7QUFDQSxJQUFNTSxLQUFLLEdBQUdOLE9BQU8sQ0FBQyxPQUFELENBQVAsQ0FBaUIsTUFBakIsQ0FBZDs7QUFDQSxJQUFNTyxhQUFhLEdBQUdQLE9BQU8sQ0FBQyxnQkFBRCxDQUE3Qjs7QUFDQSxJQUFNUSxNQUFNLEdBQUdSLE9BQU8sQ0FBQyx5QkFBRCxDQUF0Qjs7QUFDQSxJQUFNUyxXQUFXLEdBQUdULE9BQU8sQ0FBQyxlQUFELENBQTNCOztBQUNBLElBQU1VLEtBQUssR0FBR1YsT0FBTyxDQUFDLGVBQUQsQ0FBckI7O0FB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N0QsWSxHQTIwQm5CO0FBQ0E7OztBQUNBa0IsSUFBSSxDQUFDTCxPQUFMLEdBQWU7QUFDYnFHLEVBQUFBLE9BQU8sRUFBRXJHLE9BQU8sQ0FBQ3FHLE9BREo7QUFFYjNGLEVBQUFBLE9BQU8sRUFBRVYsT0FBTyxDQUFDVSxPQUZKO0FBR2I0RixFQUFBQSxRQUFRLEVBQUV0RyxPQUFPLENBQUNzRyxRQUhMO0FBSWJDLEVBQUFBLFFBQVEsRUFBRXZHLE9BQU8sQ0FBQ3VHLFFBSkw7QUFLYkMsRUFBQUEsT0FBTyxFQUFFeEcsT0FBTyxDQUFDd0csT0FMSjtBQU1icEgsRUFBQUEsT0FBTyxFQUFFWSxPQUFPLENBQUNaLE9BTko7QUFPYkUsRUFBQUEsT0FBTyxFQUFFVSxPQUFPLENBQUNWLE9BUEo7QUFRYm1ILEVBQUFBLElBQUksRUFBRXpHLE9BQU8sQ0FBQ3lHLElBUkQ7QUFTYkMsRUFBQUEsS0FBSyxFQUFFMUcsT0FBTyxDQUFDMEc7QUFURixDQUFmO0FBWUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZHLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCB7IHJlc29sdmUsIGpvaW4gfSA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuY29uc3QgY29tYmluZUVycm9ycyA9IHJlcXVpcmUoJ2NvbWJpbmUtZXJyb3JzJyk7XG5jb25zdCBjcm9uID0gcmVxdWlyZSgnY3Jvbi12YWxpZGF0ZScpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdicmVlJyk7XG5jb25zdCBodW1hbkludGVydmFsID0gcmVxdWlyZSgnaHVtYW4taW50ZXJ2YWwnKTtcbmNvbnN0IGlzU0FOQiA9IHJlcXVpcmUoJ2lzLXN0cmluZy1hbmQtbm90LWJsYW5rJyk7XG5jb25zdCBpc1ZhbGlkUGF0aCA9IHJlcXVpcmUoJ2lzLXZhbGlkLXBhdGgnKTtcbmNvbnN0IGxhdGVyID0gcmVxdWlyZSgnQGJyZWVqcy9sYXRlcicpO1xuY29uc3QgbXMgPSByZXF1aXJlKCdtcycpO1xuY29uc3QgdGhyZWFkcyA9IHJlcXVpcmUoJ2J0aHJlYWRzJyk7XG5jb25zdCB7IGJvb2xlYW4gfSA9IHJlcXVpcmUoJ2Jvb2xlYW4nKTtcbmNvbnN0IHsgc2V0VGltZW91dCwgc2V0SW50ZXJ2YWwgfSA9IHJlcXVpcmUoJ3NhZmUtdGltZXJzJyk7XG5cbi8vIGJ0aHJlYWRzIHJlcXVpcmVzIHVzIHRvIGRvIHRoaXMgZm9yIHdlYiB3b3JrZXJzIChzZWUgYnRocmVhZHMgZG9jcyBmb3IgaW5zaWdodClcbnRocmVhZHMuQnVmZmVyID0gQnVmZmVyO1xuXG4vLyBpbnN0ZWFkIG9mIGB0aHJlYWRzLmJyb3dzZXJgIGNoZWNrcyBiZWxvdywgd2UgcHJldmlvdXNseSB1c2VkIHRoaXMgYm9vbGVhblxuLy8gY29uc3QgaGFzRnNTdGF0U3luYyA9IHR5cGVvZiBmcyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGZzLnN0YXRTeW5jID09PSAnZnVuY3Rpb24nO1xuXG5jbGFzcyBCcmVlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC8vIHdlIHJlY29tbWVuZCB1c2luZyBDYWJpbiBmb3IgbG9nZ2luZ1xuICAgICAgLy8gPGh0dHBzOi8vY2FiaW5qcy5jb20+XG4gICAgICBsb2dnZXI6IGNvbnNvbGUsXG4gICAgICAvLyBzZXQgdGhpcyB0byBgZmFsc2VgIHRvIHByZXZlbnQgcmVxdWlyaW5nIGEgcm9vdCBkaXJlY3Rvcnkgb2Ygam9ic1xuICAgICAgLy8gKGUuZy4gaWYgeW91ciBqb2JzIGFyZSBub3QgYWxsIGluIG9uZSBkaXJlY3RvcnkpXG4gICAgICByb290OiB0aHJlYWRzLmJyb3dzZXJcbiAgICAgICAgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgIHRocmVhZHMucmVzb2x2ZSgnam9icycpXG4gICAgICAgIDogcmVzb2x2ZSgnam9icycpLFxuICAgICAgLy8gZGVmYXVsdCB0aW1lb3V0IGZvciBqb2JzXG4gICAgICAvLyAoc2V0IHRoaXMgdG8gYGZhbHNlYCBpZiB5b3UgZG8gbm90IHdpc2ggZm9yIGEgZGVmYXVsdCB0aW1lb3V0IHRvIGJlIHNldClcbiAgICAgIHRpbWVvdXQ6IDAsXG4gICAgICAvLyBkZWZhdWx0IGludGVydmFsIGZvciBqb2JzXG4gICAgICAvLyAoc2V0IHRoaXMgdG8gYDBgIGZvciBubyBpbnRlcnZhbCwgYW5kID4gMCBmb3IgYSBkZWZhdWx0IGludGVydmFsIHRvIGJlIHNldClcbiAgICAgIGludGVydmFsOiAwLFxuICAgICAgLy8gdGhpcyBpcyBhbiBBcnJheSBvZiB5b3VyIGpvYiBkZWZpbml0aW9ucyAoc2VlIFJFQURNRSBmb3IgZXhhbXBsZXMpXG4gICAgICBqb2JzOiBbXSxcbiAgICAgIC8vIDxodHRwczovL2JyZWVqcy5naXRodWIuaW8vbGF0ZXIvcGFyc2Vycy5odG1sI2Nyb24+XG4gICAgICAvLyAoY2FuIGJlIG92ZXJyaWRkZW4gb24gYSBqb2IgYmFzaXMgd2l0aCBzYW1lIHByb3AgbmFtZSlcbiAgICAgIGhhc1NlY29uZHM6IGZhbHNlLFxuICAgICAgLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9BaXJmb29veC9jcm9uLXZhbGlkYXRlPlxuICAgICAgY3JvblZhbGlkYXRlOiB7fSxcbiAgICAgIC8vIGlmIHlvdSBzZXQgYSB2YWx1ZSA+IDAgaGVyZSwgdGhlbiBpdCB3aWxsIHRlcm1pbmF0ZSB3b3JrZXJzIGFmdGVyIHRoaXMgdGltZSAobXMpXG4gICAgICBjbG9zZVdvcmtlckFmdGVyTXM6IDAsXG4gICAgICAvLyBjb3VsZCBhbHNvIGJlIG1qcyBpZiBkZXNpcmVkXG4gICAgICAvLyAodGhpcyBpcyB0aGUgZGVmYXVsdCBleHRlbnNpb24gaWYgeW91IGp1c3Qgc3BlY2lmeSBhIGpvYidzIG5hbWUgd2l0aG91dCBcIi5qc1wiIG9yIFwiLm1qc1wiKVxuICAgICAgZGVmYXVsdEV4dGVuc2lvbjogJ2pzJyxcbiAgICAgIC8vIGRlZmF1bHQgd29ya2VyIG9wdGlvbnMgdG8gcGFzcyB0byB+YG5ldyBXb3JrZXJgfiBgbmV3IHRocmVhZHMuV29ya2VyYFxuICAgICAgLy8gKGNhbiBiZSBvdmVycmlkZGVuIG9uIGEgcGVyIGpvYiBiYXNpcylcbiAgICAgIC8vIDxodHRwczovL25vZGVqcy5vcmcvYXBpL3dvcmtlcl90aHJlYWRzLmh0bWwjd29ya2VyX3RocmVhZHNfbmV3X3dvcmtlcl9maWxlbmFtZV9vcHRpb25zPlxuICAgICAgd29ya2VyOiB7fSxcbiAgICAgIC8vXG4gICAgICAvLyBpZiB5b3Ugc2V0IHRoaXMgdG8gYHRydWVgLCB0aGVuIGEgc2Vjb25kIGFyZyBpcyBwYXNzZWQgdG8gbG9nIG91dHB1dFxuICAgICAgLy8gYW5kIGl0IHdpbGwgYmUgYW4gT2JqZWN0IHdpdGggYHsgd29ya2VyOiBPYmplY3QgfWAgc2V0LCBmb3IgZXhhbXBsZTpcbiAgICAgIC8vIChzZWUgdGhlIGRvY3VtZW50YXRpb24gYXQgPGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvd29ya2VyX3RocmVhZHMuaHRtbD4gZm9yIG1vcmUgaW5zaWdodClcbiAgICAgIC8vXG4gICAgICAvLyBsb2dnZXIuaW5mbygnLi4uJywge1xuICAgICAgLy8gICB3b3JrZXI6IHtcbiAgICAgIC8vICAgICBpc01haW5UaHJlYWQ6IEJvb2xlYW5cbiAgICAgIC8vICAgICByZXNvdXJjZUxpbWl0czogT2JqZWN0LFxuICAgICAgLy8gICAgIHRocmVhZElkOiBTdHJpbmdcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSk7XG4gICAgICAvL1xuICAgICAgb3V0cHV0V29ya2VyTWV0YWRhdGE6IGZhbHNlLFxuICAgICAgLi4uY29uZmlnXG4gICAgfTtcblxuICAgIC8vXG4gICAgLy8gaWYgYGhhc1NlY29uZHNgIGlzIGB0cnVlYCB0aGVuIGVuc3VyZSB0aGF0XG4gICAgLy8gYGNyb25WYWxpZGF0ZWAgb2JqZWN0IGhhcyBgb3ZlcnJpZGVgIG9iamVjdCB3aXRoIGB1c2VTZWNvbmRzYCBzZXQgdG8gYHRydWVgXG4gICAgLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9icmVlanMvYnJlZS9pc3N1ZXMvNz5cbiAgICAvL1xuICAgIGlmICh0aGlzLmNvbmZpZy5oYXNTZWNvbmRzKVxuICAgICAgdGhpcy5jb25maWcuY3JvblZhbGlkYXRlID0ge1xuICAgICAgICAuLi50aGlzLmNvbmZpZy5jcm9uVmFsaWRhdGUsXG4gICAgICAgIHByZXNldDpcbiAgICAgICAgICB0aGlzLmNvbmZpZy5jcm9uVmFsaWRhdGUgJiYgdGhpcy5jb25maWcuY3JvblZhbGlkYXRlLnByZXNldFxuICAgICAgICAgICAgPyB0aGlzLmNvbmZpZy5jcm9uVmFsaWRhdGUucHJlc2V0XG4gICAgICAgICAgICA6ICdkZWZhdWx0JyxcbiAgICAgICAgb3ZlcnJpZGU6IHtcbiAgICAgICAgICAuLi4odGhpcy5jb25maWcuY3JvblZhbGlkYXRlICYmIHRoaXMuY29uZmlnLmNyb25WYWxpZGF0ZS5vdmVycmlkZVxuICAgICAgICAgICAgPyB0aGlzLmNvbmZpZy5jcm9uVmFsaWRhdGUub3ZlcnJpZGVcbiAgICAgICAgICAgIDoge30pLFxuICAgICAgICAgIHVzZVNlY29uZHM6IHRydWVcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIGRlYnVnKCdjb25maWcnLCB0aGlzLmNvbmZpZyk7XG5cbiAgICB0aGlzLmNsb3NlV29ya2VyQWZ0ZXJNcyA9IHt9O1xuICAgIHRoaXMud29ya2VycyA9IHt9O1xuICAgIHRoaXMudGltZW91dHMgPSB7fTtcbiAgICB0aGlzLmludGVydmFscyA9IHt9O1xuXG4gICAgdGhpcy52YWxpZGF0ZUpvYiA9IHRoaXMudmFsaWRhdGVKb2IuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFdvcmtlck1ldGFkYXRhID0gdGhpcy5nZXRXb3JrZXJNZXRhZGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucnVuID0gdGhpcy5ydW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3RvcCA9IHRoaXMuc3RvcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkID0gdGhpcy5hZGQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZSA9IHRoaXMucmVtb3ZlLmJpbmQodGhpcyk7XG5cbiAgICAvLyB2YWxpZGF0ZSByb290IChzeW5jIGNoZWNrKVxuICAgIGlmIChpc1NBTkIodGhpcy5jb25maWcucm9vdCkpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAoIXRocmVhZHMuYnJvd3NlciAmJiBpc1ZhbGlkUGF0aCh0aGlzLmNvbmZpZy5yb290KSkge1xuICAgICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHRoaXMuY29uZmlnLnJvb3QpO1xuICAgICAgICBpZiAoIXN0YXRzLmlzRGlyZWN0b3J5KCkpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFJvb3QgZGlyZWN0b3J5IG9mICR7dGhpcy5jb25maWcucm9vdH0gZG9lcyBub3QgZXhpc3RgXG4gICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2YWxpZGF0ZSB0aW1lb3V0XG4gICAgdGhpcy5jb25maWcudGltZW91dCA9IHRoaXMucGFyc2VWYWx1ZSh0aGlzLmNvbmZpZy50aW1lb3V0KTtcbiAgICBkZWJ1ZygndGltZW91dCcsIHRoaXMuY29uZmlnLnRpbWVvdXQpO1xuXG4gICAgLy8gdmFsaWRhdGUgaW50ZXJ2YWxcbiAgICB0aGlzLmNvbmZpZy5pbnRlcnZhbCA9IHRoaXMucGFyc2VWYWx1ZSh0aGlzLmNvbmZpZy5pbnRlcnZhbCk7XG4gICAgZGVidWcoJ2ludGVydmFsJywgdGhpcy5jb25maWcuaW50ZXJ2YWwpO1xuXG4gICAgLy9cbiAgICAvLyBpZiBgdGhpcy5jb25maWcuam9ic2AgaXMgYW4gZW1wdHkgYXJyYXlcbiAgICAvLyB0aGVuIHdlIHNob3VsZCB0cnkgdG8gbG9hZCBgam9icy9pbmRleC5qc2BcbiAgICAvL1xuICAgIGlmIChcbiAgICAgIHRoaXMuY29uZmlnLnJvb3QgJiZcbiAgICAgICghQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5qb2JzKSB8fCB0aGlzLmNvbmZpZy5qb2JzLmxlbmd0aCA9PT0gMClcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY29uZmlnLmpvYnMgPSB0aHJlYWRzLnJlcXVpcmUodGhpcy5jb25maWcucm9vdCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5jb25maWcubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyB2YWxpZGF0ZSBqb2JzXG4gICAgLy9cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5jb25maWcuam9icykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pvYnMgbXVzdCBiZSBhbiBBcnJheScpO1xuXG4gICAgLy8gcHJvdmlkZSBodW1hbi1mcmllbmRseSBlcnJvcnMgZm9yIGNvbXBsZXggY29uZmlndXJhdGlvbnNcbiAgICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAgIC8qXG4gICAgam9icyA9IFtcbiAgICAgICduYW1lJyxcbiAgICAgIHsgbmFtZTogJ2Jvb3QnIH0sXG4gICAgICB7IG5hbWU6ICd0aW1lb3V0JywgdGltZW91dDogbXMoJzNzJykgfSxcbiAgICAgIHsgbmFtZTogJ2Nyb24nLCBjcm9uOiAnKiAqICogKiAqJyB9LFxuICAgICAgeyBuYW1lOiAnY3JvbiB3aXRoIHRpbWVvdXQnLCB0aW1lb3V0OiAnM3MnLCBjcm9uOiAnKiAqICogKiAqJyB9LFxuICAgICAgeyBuYW1lOiAnaW50ZXJ2YWwnLCBpbnRlcnZhbDogbXMoJzRzJykgfVxuICAgICAgeyBuYW1lOiAnaW50ZXJ2YWwnLCBwYXRoOiAnL3NvbWUvcGF0aC90by9zY3JpcHQuanMnLCBpbnRlcnZhbDogbXMoJzRzJykgfSxcbiAgICAgIHsgbmFtZTogJ3RpbWVvdXQnLCB0aW1lb3V0OiAndGhyZWUgbWludXRlcycgfSxcbiAgICAgIHsgbmFtZTogJ2ludGVydmFsJywgaW50ZXJ2YWw6ICdvbmUgbWludXRlJyB9LFxuICAgICAgeyBuYW1lOiAndGltZW91dCcsIHRpbWVvdXQ6ICczcycgfSxcbiAgICAgIHsgbmFtZTogJ2ludGVydmFsJywgaW50ZXJ2YWw6ICczMGQnIH0sXG4gICAgICB7IG5hbWU6ICdzY2hlZHVsZSBvYmplY3QnLCBpbnRlcnZhbDogeyBzY2hlZHVsZXM6IFtdIH0gfVxuICAgIF1cbiAgICAqL1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbmZpZy5qb2JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmNvbmZpZy5qb2JzW2ldID0gdGhpcy52YWxpZGF0ZUpvYih0aGlzLmNvbmZpZy5qb2JzW2ldLCBpKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHRoZXJlIHdlcmUgYW55IGVycm9ycyB0aGVuIHRocm93IHRoZW1cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHRocm93IGNvbWJpbmVFcnJvcnMoZXJyb3JzKTtcblxuICAgIGRlYnVnKCd0aGlzLmNvbmZpZy5qb2JzJywgdGhpcy5jb25maWcuam9icyk7XG4gIH1cblxuICBnZXROYW1lKGpvYikge1xuICAgIGlmIChpc1NBTkIoam9iKSkgcmV0dXJuIGpvYjtcbiAgICBpZiAodHlwZW9mIGpvYiA9PT0gJ29iamVjdCcgJiYgaXNTQU5CKGpvYi5uYW1lKSkgcmV0dXJuIGpvYi5uYW1lO1xuICAgIGlmICh0eXBlb2Ygam9iID09PSAnZnVuY3Rpb24nICYmIGlzU0FOQihqb2IubmFtZSkpIHJldHVybiBqb2IubmFtZTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG4gIHZhbGlkYXRlSm9iKGpvYiwgaSwgaXNBZGQgPSBmYWxzZSkge1xuICAgIGNvbnN0IGVycm9ycyA9IFtdO1xuICAgIGNvbnN0IG5hbWVzID0gW107XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldE5hbWUoam9iKTtcbiAgICAgIGlmIChuYW1lKSBuYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgZWxzZSBlcnJvcnMucHVzaChuZXcgRXJyb3IoYEpvYiAjJHtpICsgMX0gaXMgbWlzc2luZyBhIG5hbWVgKSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbmZpZy5qb2JzLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5nZXROYW1lKHRoaXMuY29uZmlnLmpvYnNbal0pO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKG5ldyBFcnJvcihgSm9iICMke2kgKyAxfSBpcyBtaXNzaW5nIGEgbmFtZWApKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHRocm93IGFuIGVycm9yIGlmIGR1cGxpY2F0ZSBqb2IgbmFtZXNcbiAgICAgIGlmIChuYW1lcy5pbmNsdWRlcyhuYW1lKSlcbiAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgbmV3IEVycm9yKGBKb2IgIyR7aiArIDF9IGhhcyBhIGR1cGxpY2F0ZSBqb2IgbmFtZSBvZiAke2pvYn1gKVxuICAgICAgICApO1xuXG4gICAgICBuYW1lcy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkgdGhyb3cgY29tYmluZUVycm9ycyhlcnJvcnMpO1xuXG4gICAgLy8gc3VwcG9ydCBhIHNpbXBsZSBzdHJpbmcgd2hpY2ggd2Ugd2lsbCB0cmFuc2Zvcm0gdG8gaGF2ZSBhIHBhdGhcbiAgICBpZiAoaXNTQU5CKGpvYikpIHtcbiAgICAgIC8vIGRvbid0IGFsbG93IGEgam9iIHRvIGhhdmUgdGhlIGBpbmRleGAgZmlsZSBuYW1lXG4gICAgICBpZiAoWydpbmRleCcsICdpbmRleC5qcycsICdpbmRleC5tanMnXS5pbmNsdWRlcyhqb2IpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1lvdSBjYW5ub3QgdXNlIHRoZSByZXNlcnZlZCBqb2IgbmFtZSBvZiBcImluZGV4XCIsIFwiaW5kZXguanNcIiwgbm9yIFwiaW5kZXgubWpzXCInXG4gICAgICAgICk7XG5cbiAgICAgIGlmICghdGhpcy5jb25maWcucm9vdCkge1xuICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgSm9iICMke1xuICAgICAgICAgICAgICBpICsgMVxuICAgICAgICAgICAgfSBcIiR7am9ifVwiIHJlcXVpcmVzIHJvb3QgZGlyZWN0b3J5IG9wdGlvbiB0byBhdXRvLXBvcHVsYXRlIHBhdGhgXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICB0aHJvdyBjb21iaW5lRXJyb3JzKGVycm9ycyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhdGggPSBqb2luKFxuICAgICAgICB0aGlzLmNvbmZpZy5yb290LFxuICAgICAgICBqb2IuZW5kc1dpdGgoJy5qcycpIHx8IGpvYi5lbmRzV2l0aCgnLm1qcycpXG4gICAgICAgICAgPyBqb2JcbiAgICAgICAgICA6IGAke2pvYn0uJHt0aGlzLmNvbmZpZy5kZWZhdWx0RXh0ZW5zaW9ufWBcbiAgICAgICk7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICBpZiAoIXRocmVhZHMuYnJvd3Nlcikge1xuICAgICAgICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHBhdGgpO1xuICAgICAgICBpZiAoIXN0YXRzLmlzRmlsZSgpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSm9iICMke2kgKyAxfSBcIiR7am9ifVwiIHBhdGggbWlzc2luZzogJHtwYXRofWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBqb2IsXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHRpbWVvdXQ6IHRoaXMuY29uZmlnLnRpbWVvdXQsXG4gICAgICAgIGludGVydmFsOiB0aGlzLmNvbmZpZy5pbnRlcnZhbFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBqb2IgaXMgYSBmdW5jdGlvblxuICAgIGlmICh0eXBlb2Ygam9iID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBwYXRoID0gYCgke2pvYi50b1N0cmluZygpfSkoKWA7XG4gICAgICAvLyBjYW4ndCBiZSBhIGJ1aWx0LWluIG9yIGJvdW5kIGZ1bmN0aW9uXG4gICAgICBpZiAocGF0aC5pbmNsdWRlcygnW25hdGl2ZSBjb2RlXScpKVxuICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICBuZXcgRXJyb3IoYEpvYiAjJHtpICsgMX0gY2FuJ3QgYmUgYSBib3VuZCBvciBidWlsdC1pbiBmdW5jdGlvbmApXG4gICAgICAgICk7XG5cbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkgdGhyb3cgY29tYmluZUVycm9ycyhlcnJvcnMpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBqb2IubmFtZSxcbiAgICAgICAgcGF0aCxcbiAgICAgICAgd29ya2VyOiB7IGV2YWw6IHRydWUgfSxcbiAgICAgICAgdGltZW91dDogdGhpcy5jb25maWcudGltZW91dCxcbiAgICAgICAgaW50ZXJ2YWw6IHRoaXMuY29uZmlnLmludGVydmFsXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHVzZSBhIHByZWZpeCBmb3IgZXJyb3JzXG4gICAgY29uc3QgcHJlZml4ID0gYEpvYiAjJHtpICsgMX0gbmFtZWQgXCIke2pvYi5uYW1lfVwiYDtcblxuICAgIGlmICh0eXBlb2Ygam9iLnBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBgKCR7am9iLnBhdGgudG9TdHJpbmcoKX0pKClgO1xuXG4gICAgICAvLyBjYW4ndCBiZSBhIGJ1aWx0LWluIG9yIGJvdW5kIGZ1bmN0aW9uXG4gICAgICBpZiAocGF0aC5pbmNsdWRlcygnW25hdGl2ZSBjb2RlXScpKVxuICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICBuZXcgRXJyb3IoYEpvYiAjJHtpICsgMX0gY2FuJ3QgYmUgYSBib3VuZCBvciBidWlsdC1pbiBmdW5jdGlvbmApXG4gICAgICAgICk7XG5cbiAgICAgIGpvYi5wYXRoID0gcGF0aDtcbiAgICAgIGpvYi53b3JrZXIgPSB7XG4gICAgICAgIGV2YWw6IHRydWUsXG4gICAgICAgIC4uLmpvYi53b3JrZXJcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICghaXNTQU5CKGpvYi5wYXRoKSAmJiAhdGhpcy5jb25maWcucm9vdCkge1xuICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtwcmVmaXh9IHJlcXVpcmVzIHJvb3QgZGlyZWN0b3J5IG9wdGlvbiB0byBhdXRvLXBvcHVsYXRlIHBhdGhgXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHZhbGlkYXRlIHBhdGhcbiAgICAgIGNvbnN0IHBhdGggPSBpc1NBTkIoam9iLnBhdGgpXG4gICAgICAgID8gam9iLnBhdGhcbiAgICAgICAgOiBqb2luKFxuICAgICAgICAgICAgdGhpcy5jb25maWcucm9vdCxcbiAgICAgICAgICAgIGpvYi5uYW1lLmVuZHNXaXRoKCcuanMnKSB8fCBqb2IubmFtZS5lbmRzV2l0aCgnLm1qcycpXG4gICAgICAgICAgICAgID8gam9iLm5hbWVcbiAgICAgICAgICAgICAgOiBgJHtqb2IubmFtZX0uJHt0aGlzLmNvbmZpZy5kZWZhdWx0RXh0ZW5zaW9ufWBcbiAgICAgICAgICApO1xuICAgICAgaWYgKGlzVmFsaWRQYXRoKHBhdGgpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICBpZiAoIXRocmVhZHMuYnJvd3Nlcikge1xuICAgICAgICAgICAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhwYXRoKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtZGVwdGhcbiAgICAgICAgICAgIGlmICghc3RhdHMuaXNGaWxlKCkpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtwcmVmaXh9IHBhdGggbWlzc2luZzogJHtwYXRofWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghaXNTQU5CKGpvYi5wYXRoKSkgam9iLnBhdGggPSBwYXRoO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGEgdHJhbnNmb3JtZWQgZXZhbCBzdHJpbmdcbiAgICAgICAgam9iLndvcmtlciA9IHtcbiAgICAgICAgICBldmFsOiB0cnVlLFxuICAgICAgICAgIC4uLmpvYi53b3JrZXJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkb24ndCBhbGxvdyB1c2VycyB0byBtaXggaW50ZXJ2YWwgQU5EIGNyb25cbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygam9iLmludGVydmFsICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGpvYi5jcm9uICE9PSAndW5kZWZpbmVkJ1xuICAgICkge1xuICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgIG5ldyBFcnJvcihgJHtwcmVmaXh9IGNhbm5vdCBoYXZlIGJvdGggaW50ZXJ2YWwgYW5kIGNyb24gY29uZmlndXJhdGlvbmApXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGRvbid0IGFsbG93IHVzZXJzIHRvIG1peCB0aW1lb3V0IEFORCBkYXRlXG4gICAgaWYgKHR5cGVvZiBqb2IudGltZW91dCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGpvYi5kYXRlICE9PSAndW5kZWZpbmVkJylcbiAgICAgIGVycm9ycy5wdXNoKG5ldyBFcnJvcihgJHtwcmVmaXh9IGNhbm5vdCBoYXZlIGJvdGggdGltZW91dCBhbmQgZGF0ZWApKTtcblxuICAgIC8vIGRvbid0IGFsbG93IGEgam9iIHRvIGhhdmUgdGhlIGBpbmRleGAgZmlsZSBuYW1lXG4gICAgaWYgKFsnaW5kZXgnLCAnaW5kZXguanMnLCAnaW5kZXgubWpzJ10uaW5jbHVkZXMoam9iLm5hbWUpKSB7XG4gICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICdZb3UgY2Fubm90IHVzZSB0aGUgcmVzZXJ2ZWQgam9iIG5hbWUgb2YgXCJpbmRleFwiLCBcImluZGV4LmpzXCIsIG5vciBcImluZGV4Lm1qc1wiJ1xuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICB0aHJvdyBjb21iaW5lRXJyb3JzKGVycm9ycyk7XG4gICAgfVxuXG4gICAgLy8gdmFsaWRhdGUgZGF0ZVxuICAgIGlmICh0eXBlb2Ygam9iLmRhdGUgIT09ICd1bmRlZmluZWQnICYmICEoam9iLmRhdGUgaW5zdGFuY2VvZiBEYXRlKSlcbiAgICAgIGVycm9ycy5wdXNoKG5ldyBFcnJvcihgJHtwcmVmaXh9IGhhZCBhbiBpbnZhbGlkIERhdGUgb2YgJHtqb2IuZGF0ZX1gKSk7XG5cbiAgICAvLyB2YWxpZGF0ZSB0aW1lb3V0XG4gICAgaWYgKHR5cGVvZiBqb2IudGltZW91dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGpvYi50aW1lb3V0ID0gdGhpcy5wYXJzZVZhbHVlKGpvYi50aW1lb3V0KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgICBjb21iaW5lRXJyb3JzKFtcbiAgICAgICAgICAgIG5ldyBFcnJvcihgJHtwcmVmaXh9IGhhZCBhbiBpbnZhbGlkIHRpbWVvdXQgb2YgJHtqb2IudGltZW91dH1gKSxcbiAgICAgICAgICAgIGVyclxuICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmFsaWRhdGUgaW50ZXJ2YWxcbiAgICBpZiAodHlwZW9mIGpvYi5pbnRlcnZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGpvYi5pbnRlcnZhbCA9IHRoaXMucGFyc2VWYWx1ZShqb2IuaW50ZXJ2YWwpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICAgIGNvbWJpbmVFcnJvcnMoW1xuICAgICAgICAgICAgbmV3IEVycm9yKGAke3ByZWZpeH0gaGFkIGFuIGludmFsaWQgaW50ZXJ2YWwgb2YgJHtqb2IuaW50ZXJ2YWx9YCksXG4gICAgICAgICAgICBlcnJcbiAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIGhhc1NlY29uZHNcbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygam9iLmhhc1NlY29uZHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmhhc1NlY29uZHMgIT09ICdib29sZWFuJ1xuICAgIClcbiAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7cHJlZml4fSBoYWQgaGFzU2Vjb25kcyB2YWx1ZSBvZiAke2pvYi5oYXNTZWNvbmRzfSAoaXQgbXVzdCBiZSBhIEJvb2xlYW4pYFxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgLy8gdmFsaWRhdGUgY3JvblZhbGlkYXRlXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIGpvYi5jcm9uVmFsaWRhdGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmNyb25WYWxpZGF0ZSAhPT0gJ29iamVjdCdcbiAgICApXG4gICAgICBlcnJvcnMucHVzaChcbiAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgIGAke3ByZWZpeH0gaGFkIGNyb25WYWxpZGF0ZSB2YWx1ZSBzZXQsIGJ1dCBpdCBtdXN0IGJlIGFuIE9iamVjdGBcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgIC8vIGlmIGBoYXNTZWNvbmRzYCB3YXMgYHRydWVgIHRoZW4gc2V0IGBjcm9uVmFsaWRhdGVgIGFuZCBpbmhlcml0IGFueSBleGlzdGluZyBvcHRpb25zXG4gICAgaWYgKGpvYi5oYXNTZWNvbmRzKSB7XG4gICAgICBjb25zdCBwcmVzZXQgPVxuICAgICAgICBqb2IuY3JvblZhbGlkYXRlICYmIGpvYi5jcm9uVmFsaWRhdGUucHJlc2V0XG4gICAgICAgICAgPyBqb2IuY3JvblZhbGlkYXRlLnByZXNldFxuICAgICAgICAgIDogdGhpcy5jb25maWcuY3JvblZhbGlkYXRlICYmIHRoaXMuY29uZmlnLmNyb25WYWxpZGF0ZS5wcmVzZXRcbiAgICAgICAgICA/IHRoaXMuY29uZmlnLmNyb25WYWxpZGF0ZS5wcmVzZXRcbiAgICAgICAgICA6ICdkZWZhdWx0JztcbiAgICAgIGNvbnN0IG92ZXJyaWRlID0ge1xuICAgICAgICAuLi4odGhpcy5jb25maWcuY3JvblZhbGlkYXRlICYmIHRoaXMuY29uZmlnLmNyb25WYWxpZGF0ZS5vdmVycmlkZVxuICAgICAgICAgID8gdGhpcy5jb25maWcuY3JvblZhbGlkYXRlLm92ZXJyaWRlXG4gICAgICAgICAgOiB7fSksXG4gICAgICAgIC4uLihqb2IuY3JvblZhbGlkYXRlICYmIGpvYi5jcm9uVmFsaWRhdGUub3ZlcnJpZGVcbiAgICAgICAgICA/IGpvYi5jcm9uVmFsaWRhdGUub3ZlcnJpZGVcbiAgICAgICAgICA6IHt9KSxcbiAgICAgICAgdXNlU2Vjb25kczogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGpvYi5jcm9uVmFsaWRhdGUgPSB7XG4gICAgICAgIC4uLnRoaXMuY29uZmlnLmNyb25WYWxpZGF0ZSxcbiAgICAgICAgLi4uam9iLmNyb25WYWxpZGF0ZSxcbiAgICAgICAgcHJlc2V0LFxuICAgICAgICBvdmVycmlkZVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB2YWxpZGF0ZSBjcm9uXG4gICAgaWYgKHR5cGVvZiBqb2IuY3JvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmlzU2NoZWR1bGUoam9iLmNyb24pKSB7XG4gICAgICAgIGpvYi5pbnRlcnZhbCA9IGpvYi5jcm9uO1xuICAgICAgICAvLyBkZWxldGUgam9iLmNyb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL1xuICAgICAgICAvLyB2YWxpZGF0ZSBjcm9uIHBhdHRlcm5cbiAgICAgICAgLy8gKG11c3Qgc3VwcG9ydCBwYXR0ZXJucyBzdWNoIGFzIGAqICogTCAqICpgIGFuZCBgMCAwLzUgMTQgKiAqID9gIChhbmQgYWxpYXNlcyB0b28pXG4gICAgICAgIC8vXG4gICAgICAgIC8vICA8aHR0cHM6Ly9naXRodWIuY29tL0FpcmZvb294L2Nyb24tdmFsaWRhdGUvaXNzdWVzLzY3PlxuICAgICAgICAvL1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjcm9uKFxuICAgICAgICAgIGpvYi5jcm9uLFxuICAgICAgICAgIHR5cGVvZiBqb2IuY3JvblZhbGlkYXRlID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyB0aGlzLmNvbmZpZy5jcm9uVmFsaWRhdGVcbiAgICAgICAgICAgIDogam9iLmNyb25WYWxpZGF0ZVxuICAgICAgICApO1xuICAgICAgICBpZiAocmVzdWx0LmlzVmFsaWQoKSkge1xuICAgICAgICAgIGpvYi5pbnRlcnZhbCA9IGxhdGVyLnBhcnNlLmNyb24oXG4gICAgICAgICAgICBqb2IuY3JvbixcbiAgICAgICAgICAgIGJvb2xlYW4oXG4gICAgICAgICAgICAgIHR5cGVvZiBqb2IuaGFzU2Vjb25kcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IHRoaXMuY29uZmlnLmhhc1NlY29uZHNcbiAgICAgICAgICAgICAgICA6IGpvYi5oYXNTZWNvbmRzXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBOT1RFOiBpdCBpcyBhbHdheXMgdmFsaWRcbiAgICAgICAgICAvLyBjb25zdCBzY2hlZHVsZSA9IGxhdGVyLnNjaGVkdWxlKFxuICAgICAgICAgIC8vICAgbGF0ZXIucGFyc2UuY3JvbihcbiAgICAgICAgICAvLyAgICAgam9iLmNyb24sXG4gICAgICAgICAgLy8gICAgIGJvb2xlYW4oXG4gICAgICAgICAgLy8gICAgICAgdHlwZW9mIGpvYi5oYXNTZWNvbmRzID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgIC8vICAgICAgICAgPyB0aGlzLmNvbmZpZy5oYXNTZWNvbmRzXG4gICAgICAgICAgLy8gICAgICAgICA6IGpvYi5oYXNTZWNvbmRzXG4gICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAvLyAgIClcbiAgICAgICAgICAvLyApO1xuICAgICAgICAgIC8vIGlmIChzY2hlZHVsZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAvLyAgIGpvYi5pbnRlcnZhbCA9IHNjaGVkdWxlO1xuICAgICAgICAgIC8vIH0gLy8gZWxzZSB7XG4gICAgICAgICAgLy8gICBlcnJvcnMucHVzaChcbiAgICAgICAgICAvLyAgICAgbmV3IEVycm9yKFxuICAgICAgICAgIC8vICAgICAgIGAke3ByZWZpeH0gaGFkIGFuIGludmFsaWQgY3JvbiBzY2hlZHVsZSAoc2VlIDxodHRwczovL2Nyb250YWIuZ3VydT4gaWYgeW91IG5lZWQgaGVscClgXG4gICAgICAgICAgLy8gICAgIClcbiAgICAgICAgICAvLyAgICk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiByZXN1bHQuZ2V0RXJyb3IoKSkge1xuICAgICAgICAgICAgZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgIG5ldyBFcnJvcihgJHtwcmVmaXh9IGhhZCBhbiBpbnZhbGlkIGNyb24gcGF0dGVybjogJHttZXNzYWdlfWApXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIGNsb3NlV29ya2VyQWZ0ZXJNc1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqb2IuY2xvc2VXb3JrZXJBZnRlck1zICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgKCFOdW1iZXIuaXNGaW5pdGUoam9iLmNsb3NlV29ya2VyQWZ0ZXJNcykgfHwgam9iLmNsb3NlV29ya2VyQWZ0ZXJNcyA8PSAwKVxuICAgIClcbiAgICAgIGVycm9ycy5wdXNoKFxuICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7cHJlZml4fSBoYWQgYW4gaW52YWxpZCBjbG9zZVdvcmtlcnNBZnRlck1zIHZhbHVlIG9mICR7am9iLmNsb3NlV29ya2Vyc0FmdGVyTXN9IChpdCBtdXN0IGJlIGEgZmluaXRlIG51bWJlciA+IDApYFxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB0aHJvdyBjb21iaW5lRXJyb3JzKGVycm9ycyk7XG5cbiAgICAvLyBpZiB0aW1lb3V0IHdhcyB1bmRlZmluZWQsIGNyb24gd2FzIHVuZGVmaW5lZCxcbiAgICAvLyBhbmQgZGF0ZSB3YXMgdW5kZWZpbmVkIHRoZW4gc2V0IHRoZSBkZWZhdWx0XG4gICAgLy8gKGFzIGxvbmcgYXMgdGhlIGRlZmF1bHQgdGltZW91dCBpcyA+PSAwKVxuICAgIGlmIChcbiAgICAgIE51bWJlci5pc0Zpbml0ZSh0aGlzLmNvbmZpZy50aW1lb3V0KSAmJlxuICAgICAgdGhpcy5jb25maWcudGltZW91dCA+PSAwICYmXG4gICAgICB0eXBlb2Ygam9iLnRpbWVvdXQgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmNyb24gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmRhdGUgPT09ICd1bmRlZmluZWQnXG4gICAgKVxuICAgICAgam9iLnRpbWVvdXQgPSB0aGlzLmNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gaWYgaW50ZXJ2YWwgd2FzIHVuZGVmaW5lZCwgY3JvbiB3YXMgdW5kZWZpbmVkLFxuICAgIC8vIGFuZCBkYXRlIHdhcyB1bmRlZmluZWQgdGhlbiBzZXQgdGhlIGRlZmF1bHRcbiAgICAvLyAoYXMgbG9uZyBhcyB0aGUgZGVmYXVsdCBpbnRlcnZhbCBpcyA+IDAsIG9yIGl0IHdhcyBhIHNjaGVkdWxlLCBvciBpdCB3YXMgdmFsaWQpXG4gICAgaWYgKFxuICAgICAgKChOdW1iZXIuaXNGaW5pdGUodGhpcy5jb25maWcuaW50ZXJ2YWwpICYmIHRoaXMuY29uZmlnLmludGVydmFsID4gMCkgfHxcbiAgICAgICAgdGhpcy5pc1NjaGVkdWxlKHRoaXMuY29uZmlnLmludGVydmFsKSkgJiZcbiAgICAgIHR5cGVvZiBqb2IuaW50ZXJ2YWwgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmNyb24gPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygam9iLmRhdGUgPT09ICd1bmRlZmluZWQnXG4gICAgKVxuICAgICAgam9iLmludGVydmFsID0gdGhpcy5jb25maWcuaW50ZXJ2YWw7XG5cbiAgICByZXR1cm4gam9iO1xuICB9XG5cbiAgZ2V0SHVtYW5Ub01zKF92YWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlID0gaHVtYW5JbnRlcnZhbChfdmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNOYU4odmFsdWUpKSByZXR1cm4gbXMoX3ZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwYXJzZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBmYWxzZSkgcmV0dXJuIHZhbHVlO1xuXG4gICAgaWYgKHRoaXMuaXNTY2hlZHVsZSh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblxuICAgIGlmIChpc1NBTkIodmFsdWUpKSB7XG4gICAgICBjb25zdCBzY2hlZHVsZSA9IGxhdGVyLnNjaGVkdWxlKGxhdGVyLnBhcnNlLnRleHQodmFsdWUpKTtcbiAgICAgIGlmIChzY2hlZHVsZS5pc1ZhbGlkKCkpIHJldHVybiBsYXRlci5wYXJzZS50ZXh0KHZhbHVlKTtcbiAgICAgIHZhbHVlID0gdGhpcy5nZXRIdW1hblRvTXModmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHZhbHVlKSB8fCB2YWx1ZSA8IDApXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBWYWx1ZSAke3ZhbHVlfSBtdXN0IGJlIGEgZmluaXRlIG51bWJlciA+PSAwIG9yIGEgU3RyaW5nIHBhcnNlYWJsZSBieSBcXGBsYXRlci5wYXJzZS50ZXh0XFxgIChzZWUgPGh0dHBzOi8vYnJlZWpzLmdpdGh1Yi5pby9sYXRlci9wYXJzZXJzLmh0bWwjdGV4dD4gZm9yIGV4YW1wbGVzKWBcbiAgICAgICk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpc1NjaGVkdWxlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZS5zY2hlZHVsZXMpO1xuICB9XG5cbiAgZ2V0V29ya2VyTWV0YWRhdGEobmFtZSwgbWV0YSA9IHt9KSB7XG4gICAgY29uc3Qgam9iID0gdGhpcy5jb25maWcuam9icy5maW5kKChqKSA9PiBqLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmICgham9iKSB0aHJvdyBuZXcgRXJyb3IoYEpvYiBcIiR7bmFtZX1cIiBkb2VzIG5vdCBleGlzdGApO1xuICAgIGlmICghdGhpcy5jb25maWcub3V0cHV0V29ya2VyTWV0YWRhdGEgJiYgIWpvYi5vdXRwdXRXb3JrZXJNZXRhZGF0YSlcbiAgICAgIHJldHVybiBtZXRhICYmXG4gICAgICAgICh0eXBlb2YgbWV0YS5lcnIgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBtZXRhLm1lc3NhZ2UgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICA/IG1ldGFcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMud29ya2Vyc1tuYW1lXVxuICAgICAgPyB7XG4gICAgICAgICAgLi4ubWV0YSxcbiAgICAgICAgICB3b3JrZXI6IHtcbiAgICAgICAgICAgIGlzTWFpblRocmVhZDogdGhpcy53b3JrZXJzW25hbWVdLmlzTWFpblRocmVhZCxcbiAgICAgICAgICAgIHJlc291cmNlTGltaXRzOiB0aGlzLndvcmtlcnNbbmFtZV0ucmVzb3VyY2VMaW1pdHMsXG4gICAgICAgICAgICB0aHJlYWRJZDogdGhpcy53b3JrZXJzW25hbWVdLnRocmVhZElkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICA6IG1ldGE7XG4gIH1cblxuICBydW4obmFtZSkge1xuICAgIGRlYnVnKCdydW4nLCBuYW1lKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgY29uc3Qgam9iID0gdGhpcy5jb25maWcuam9icy5maW5kKChqKSA9PiBqLm5hbWUgPT09IG5hbWUpO1xuICAgICAgaWYgKCFqb2IpIHRocm93IG5ldyBFcnJvcihgSm9iIFwiJHtuYW1lfVwiIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICBpZiAodGhpcy53b3JrZXJzW25hbWVdKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubG9nZ2VyLndhcm4oXG4gICAgICAgICAgbmV3IEVycm9yKGBKb2IgXCIke25hbWV9XCIgaXMgYWxyZWFkeSBydW5uaW5nYCksXG4gICAgICAgICAgdGhpcy5nZXRXb3JrZXJNZXRhZGF0YShuYW1lKVxuICAgICAgICApO1xuICAgICAgZGVidWcoJ3N0YXJ0aW5nIHdvcmtlcicsIG5hbWUpO1xuICAgICAgY29uc3Qgb2JqZWN0ID0ge1xuICAgICAgICAuLi4odGhpcy5jb25maWcud29ya2VyID8gdGhpcy5jb25maWcud29ya2VyIDoge30pLFxuICAgICAgICAuLi4oam9iLndvcmtlciA/IGpvYi53b3JrZXIgOiB7fSksXG4gICAgICAgIHdvcmtlckRhdGE6IHtcbiAgICAgICAgICBqb2IsXG4gICAgICAgICAgLi4uKHRoaXMuY29uZmlnLndvcmtlciAmJiB0aGlzLmNvbmZpZy53b3JrZXIud29ya2VyRGF0YVxuICAgICAgICAgICAgPyB0aGlzLmNvbmZpZy53b3JrZXIud29ya2VyRGF0YVxuICAgICAgICAgICAgOiB7fSksXG4gICAgICAgICAgLi4uKGpvYi53b3JrZXIgJiYgam9iLndvcmtlci53b3JrZXJEYXRhID8gam9iLndvcmtlci53b3JrZXJEYXRhIDoge30pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLndvcmtlcnNbbmFtZV0gPSBuZXcgdGhyZWFkcy5Xb3JrZXIoam9iLnBhdGgsIG9iamVjdCk7XG4gICAgICB0aGlzLmVtaXQoJ3dvcmtlciBjcmVhdGVkJywgbmFtZSk7XG4gICAgICBkZWJ1Zygnd29ya2VyIHN0YXJ0ZWQnLCBuYW1lKTtcblxuICAgICAgLy8gaWYgd2Ugc3BlY2lmaWVkIGEgdmFsdWUgZm9yIGBjbG9zZVdvcmtlckFmdGVyTXNgXG4gICAgICAvLyB0aGVuIHdlIG5lZWQgdG8gdGVybWluYXRlIGl0IGFmdGVyIHRoYXQgZXhlY3V0aW9uIHRpbWVcbiAgICAgIGNvbnN0IGNsb3NlV29ya2VyQWZ0ZXJNcyA9IE51bWJlci5pc0Zpbml0ZShqb2IuY2xvc2VXb3JrZXJBZnRlck1zKVxuICAgICAgICA/IGpvYi5jbG9zZVdvcmtlckFmdGVyTXNcbiAgICAgICAgOiB0aGlzLmNvbmZpZy5jbG9zZVdvcmtlckFmdGVyTXM7XG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNsb3NlV29ya2VyQWZ0ZXJNcykgJiYgY2xvc2VXb3JrZXJBZnRlck1zID4gMCkge1xuICAgICAgICBkZWJ1Zygnd29ya2VyIGhhcyBjbG9zZSBzZXQnLCBuYW1lLCBjbG9zZVdvcmtlckFmdGVyTXMpO1xuICAgICAgICB0aGlzLmNsb3NlV29ya2VyQWZ0ZXJNc1tuYW1lXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLndvcmtlcnNbbmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMud29ya2Vyc1tuYW1lXS50ZXJtaW5hdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGNsb3NlV29ya2VyQWZ0ZXJNcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZWZpeCA9IGBXb3JrZXIgZm9yIGpvYiBcIiR7bmFtZX1cImA7XG4gICAgICB0aGlzLndvcmtlcnNbbmFtZV0ub24oJ29ubGluZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWcubG9nZ2VyLmluZm8oXG4gICAgICAgICAgYCR7cHJlZml4fSBvbmxpbmVgLFxuICAgICAgICAgIHRoaXMuZ2V0V29ya2VyTWV0YWRhdGEobmFtZSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy53b3JrZXJzW25hbWVdLm9uKCdtZXNzYWdlJywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdkb25lJykge1xuICAgICAgICAgIHRoaXMuY29uZmlnLmxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgYCR7cHJlZml4fSBzaWduYWxlZCBjb21wbGV0aW9uYCxcbiAgICAgICAgICAgIHRoaXMuZ2V0V29ya2VyTWV0YWRhdGEobmFtZSlcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMud29ya2Vyc1tuYW1lXS5yZW1vdmVBbGxMaXN0ZW5lcnMoJ21lc3NhZ2UnKTtcbiAgICAgICAgICB0aGlzLndvcmtlcnNbbmFtZV0ucmVtb3ZlQWxsTGlzdGVuZXJzKCdleGl0Jyk7XG4gICAgICAgICAgdGhpcy53b3JrZXJzW25hbWVdLnRlcm1pbmF0ZSgpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLndvcmtlcnNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcubG9nZ2VyLmluZm8oXG4gICAgICAgICAgYCR7cHJlZml4fSBzZW50IGEgbWVzc2FnZWAsXG4gICAgICAgICAgdGhpcy5nZXRXb3JrZXJNZXRhZGF0YShuYW1lLCB7IG1lc3NhZ2UgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgLy8gTk9URTogeW91IGNhbm5vdCBjYXRjaCBtZXNzYWdlZXJyb3Igc2luY2UgaXQgaXMgYSBOb2RlIGludGVybmFsXG4gICAgICAvLyAgICAgICAoaWYgYW55b25lIGhhcyBhbnkgaWRlYSBob3cgdG8gY2F0Y2ggdGhpcyBpbiB0ZXN0cyBsZXQgdXMga25vdylcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICB0aGlzLndvcmtlcnNbbmFtZV0ub24oJ21lc3NhZ2VlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWcubG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGAke3ByZWZpeH0gaGFkIGEgbWVzc2FnZSBlcnJvcmAsXG4gICAgICAgICAgdGhpcy5nZXRXb3JrZXJNZXRhZGF0YShuYW1lLCB7IGVyciB9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICB0aGlzLndvcmtlcnNbbmFtZV0ub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpZy5sb2dnZXIuZXJyb3IoXG4gICAgICAgICAgYCR7cHJlZml4fSBoYWQgYW4gZXJyb3JgLFxuICAgICAgICAgIHRoaXMuZ2V0V29ya2VyTWV0YWRhdGEobmFtZSwgeyBlcnIgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy53b3JrZXJzW25hbWVdLm9uKCdleGl0JywgKGNvZGUpID0+IHtcbiAgICAgICAgdGhpcy5jb25maWcubG9nZ2VyW2NvZGUgPT09IDAgPyAnaW5mbycgOiAnZXJyb3InXShcbiAgICAgICAgICBgJHtwcmVmaXh9IGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWAsXG4gICAgICAgICAgdGhpcy5nZXRXb3JrZXJNZXRhZGF0YShuYW1lKVxuICAgICAgICApO1xuICAgICAgICBkZWxldGUgdGhpcy53b3JrZXJzW25hbWVdO1xuICAgICAgICB0aGlzLmVtaXQoJ3dvcmtlciBkZWxldGVkJywgbmFtZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGpvYiBvZiB0aGlzLmNvbmZpZy5qb2JzKSB7XG4gICAgICB0aGlzLnJ1bihqb2IubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQobmFtZSkge1xuICAgIGRlYnVnKCdzdGFydCcsIG5hbWUpO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBjb25zdCBqb2IgPSB0aGlzLmNvbmZpZy5qb2JzLmZpbmQoKGopID0+IGoubmFtZSA9PT0gbmFtZSk7XG4gICAgICBpZiAoIWpvYikgdGhyb3cgbmV3IEVycm9yKGBKb2IgJHtuYW1lfSBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgaWYgKHRoaXMudGltZW91dHNbbmFtZV0gfHwgdGhpcy5pbnRlcnZhbHNbbmFtZV0pXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5sb2dnZXIud2FybihcbiAgICAgICAgICBuZXcgRXJyb3IoYEpvYiBcIiR7bmFtZX1cIiBpcyBhbHJlYWR5IHN0YXJ0ZWRgKVxuICAgICAgICApO1xuXG4gICAgICBkZWJ1Zygnam9iJywgam9iKTtcblxuICAgICAgLy8gY2hlY2sgZm9yIGRhdGUgYW5kIGlmIGl0IGlzIGluIHRoZSBwYXN0IHRoZW4gZG9uJ3QgcnVuIGl0XG4gICAgICBpZiAoam9iLmRhdGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGRlYnVnKCdqb2IgZGF0ZScsIGpvYik7XG4gICAgICAgIGlmIChqb2IuZGF0ZS5nZXRUaW1lKCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgZGVidWcoJ2pvYiBkYXRlIHdhcyBpbiB0aGUgcGFzdCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGltZW91dHNbbmFtZV0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJ1bihuYW1lKTtcbiAgICAgICAgICBpZiAodGhpcy5pc1NjaGVkdWxlKGpvYi5pbnRlcnZhbCkpIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgc2NoZWR1bGUnLCBqb2IpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbHNbbmFtZV0gPSBsYXRlci5zZXRJbnRlcnZhbChcbiAgICAgICAgICAgICAgKCkgPT4gdGhpcy5ydW4obmFtZSksXG4gICAgICAgICAgICAgIGpvYi5pbnRlcnZhbFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0Zpbml0ZShqb2IuaW50ZXJ2YWwpICYmIGpvYi5pbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgZmluaXRlJywgam9iKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxzW25hbWVdID0gc2V0SW50ZXJ2YWwoXG4gICAgICAgICAgICAgICgpID0+IHRoaXMucnVuKG5hbWUpLFxuICAgICAgICAgICAgICBqb2IuaW50ZXJ2YWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBqb2IuZGF0ZS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGlzIGlzIG9ubHkgY29tcGxleCBiZWNhdXNlIGJvdGggdGltZW91dCBhbmQgaW50ZXJ2YWwgY2FuIGJlIGEgc2NoZWR1bGVcbiAgICAgIGlmICh0aGlzLmlzU2NoZWR1bGUoam9iLnRpbWVvdXQpKSB7XG4gICAgICAgIGRlYnVnKCdqb2IgdGltZW91dCBpcyBzY2hlZHVsZScsIGpvYik7XG4gICAgICAgIHRoaXMudGltZW91dHNbbmFtZV0gPSBsYXRlci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJ1bihuYW1lKTtcbiAgICAgICAgICBpZiAodGhpcy5pc1NjaGVkdWxlKGpvYi5pbnRlcnZhbCkpIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgc2NoZWR1bGUnLCBqb2IpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbHNbbmFtZV0gPSBsYXRlci5zZXRJbnRlcnZhbChcbiAgICAgICAgICAgICAgKCkgPT4gdGhpcy5ydW4obmFtZSksXG4gICAgICAgICAgICAgIGpvYi5pbnRlcnZhbFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0Zpbml0ZShqb2IuaW50ZXJ2YWwpICYmIGpvYi5pbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgZmluaXRlJywgam9iKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxzW25hbWVdID0gc2V0SW50ZXJ2YWwoXG4gICAgICAgICAgICAgICgpID0+IHRoaXMucnVuKG5hbWUpLFxuICAgICAgICAgICAgICBqb2IuaW50ZXJ2YWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBqb2IudGltZW91dCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShqb2IudGltZW91dCkpIHtcbiAgICAgICAgZGVidWcoJ2pvYiB0aW1lb3V0IGlzIGZpbml0ZScsIGpvYik7XG4gICAgICAgIHRoaXMudGltZW91dHNbbmFtZV0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJ1bihuYW1lKTtcbiAgICAgICAgICBpZiAodGhpcy5pc1NjaGVkdWxlKGpvYi5pbnRlcnZhbCkpIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgc2NoZWR1bGUnLCBqb2IpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbHNbbmFtZV0gPSBsYXRlci5zZXRJbnRlcnZhbChcbiAgICAgICAgICAgICAgKCkgPT4gdGhpcy5ydW4obmFtZSksXG4gICAgICAgICAgICAgIGpvYi5pbnRlcnZhbFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKE51bWJlci5pc0Zpbml0ZShqb2IuaW50ZXJ2YWwpICYmIGpvYi5pbnRlcnZhbCA+IDApIHtcbiAgICAgICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgZmluaXRlJywgam9iLmludGVydmFsKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWxzW25hbWVdID0gc2V0SW50ZXJ2YWwoXG4gICAgICAgICAgICAgICgpID0+IHRoaXMucnVuKG5hbWUpLFxuICAgICAgICAgICAgICBqb2IuaW50ZXJ2YWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBqb2IudGltZW91dCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNTY2hlZHVsZShqb2IuaW50ZXJ2YWwpKSB7XG4gICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgc2NoZWR1bGUnLCBqb2IpO1xuICAgICAgICB0aGlzLmludGVydmFsc1tuYW1lXSA9IGxhdGVyLnNldEludGVydmFsKFxuICAgICAgICAgICgpID0+IHRoaXMucnVuKG5hbWUpLFxuICAgICAgICAgIGpvYi5pbnRlcnZhbFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChOdW1iZXIuaXNGaW5pdGUoam9iLmludGVydmFsKSAmJiBqb2IuaW50ZXJ2YWwgPiAwKSB7XG4gICAgICAgIGRlYnVnKCdqb2IuaW50ZXJ2YWwgaXMgZmluaXRlJywgam9iKTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbHNbbmFtZV0gPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnJ1bihuYW1lKSwgam9iLmludGVydmFsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qgam9iIG9mIHRoaXMuY29uZmlnLmpvYnMpIHtcbiAgICAgIHRoaXMuc3RhcnQoam9iLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3AobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBpZiAodGhpcy50aW1lb3V0c1tuYW1lXSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZW9mIHRoaXMudGltZW91dHNbbmFtZV0gPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgdHlwZW9mIHRoaXMudGltZW91dHNbbmFtZV0uY2xlYXIgPT09ICdmdW5jdGlvbidcbiAgICAgICAgKVxuICAgICAgICAgIHRoaXMudGltZW91dHNbbmFtZV0uY2xlYXIoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMudGltZW91dHNbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmludGVydmFsc1tuYW1lXSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZW9mIHRoaXMuaW50ZXJ2YWxzW25hbWVdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIHR5cGVvZiB0aGlzLmludGVydmFsc1tuYW1lXS5jbGVhciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICApXG4gICAgICAgICAgdGhpcy5pbnRlcnZhbHNbbmFtZV0uY2xlYXIoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuaW50ZXJ2YWxzW25hbWVdO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy53b3JrZXJzW25hbWVdKSB7XG4gICAgICAgIHRoaXMud29ya2Vyc1tuYW1lXS5vbmNlKCdtZXNzYWdlJywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICBpZiAobWVzc2FnZSA9PT0gJ2NhbmNlbGxlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICBgR3JhY2VmdWxseSBjYW5jZWxsZWQgd29ya2VyIGZvciBqb2IgXCIke25hbWV9XCJgLFxuICAgICAgICAgICAgICB0aGlzLmdldFdvcmtlck1ldGFkYXRhKG5hbWUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy53b3JrZXJzW25hbWVdLnRlcm1pbmF0ZSgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMud29ya2Vyc1tuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLndvcmtlcnNbbmFtZV0ucG9zdE1lc3NhZ2UoJ2NhbmNlbCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbG9zZVdvcmtlckFmdGVyTXNbbmFtZV0pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiB0aGlzLmNsb3NlV29ya2VyQWZ0ZXJNc1tuYW1lXSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICB0eXBlb2YgdGhpcy5jbG9zZVdvcmtlckFmdGVyTXNbbmFtZV0uY2xlYXIgPT09ICdmdW5jdGlvbidcbiAgICAgICAgKVxuICAgICAgICAgIHRoaXMuY2xvc2VXb3JrZXJBZnRlck1zW25hbWVdLmNsZWFyKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNsb3NlV29ya2VyQWZ0ZXJNc1tuYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qgam9iIG9mIHRoaXMuY29uZmlnLmpvYnMpIHtcbiAgICAgIHRoaXMuc3RvcChqb2IubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgYWRkKGpvYnMpIHtcbiAgICAvL1xuICAgIC8vIG1ha2Ugc3VyZSBqb2JzIGlzIGFuIGFycmF5XG4gICAgLy9cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoam9icykpIGpvYnMgPSBbam9ic107XG5cbiAgICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgW2ksIGpvYl9dIG9mIGpvYnMuZW50cmllcygpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBqb2IgPSB0aGlzLnZhbGlkYXRlSm9iKGpvYl8sIGksIHRydWUpO1xuICAgICAgICB0aGlzLmNvbmZpZy5qb2JzLnB1c2goam9iKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCdqb2JzIGFkZGVkJywgdGhpcy5jb25maWcuam9icyk7XG5cbiAgICAvLyBpZiB0aGVyZSB3ZXJlIGFueSBlcnJvcnMgdGhlbiB0aHJvdyB0aGVtXG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB0aHJvdyBjb21iaW5lRXJyb3JzKGVycm9ycyk7XG4gIH1cblxuICByZW1vdmUobmFtZSkge1xuICAgIGNvbnN0IGpvYiA9IHRoaXMuY29uZmlnLmpvYnMuZmluZCgoaikgPT4gai5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAoIWpvYikgdGhyb3cgbmV3IEVycm9yKGBKb2IgXCIke25hbWV9XCIgZG9lcyBub3QgZXhpc3RgKTtcblxuICAgIHRoaXMuY29uZmlnLmpvYnMgPSB0aGlzLmNvbmZpZy5qb2JzLmZpbmQoKGopID0+IGoubmFtZSAhPT0gbmFtZSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgaXQgYWxzbyBjbG9zZXMgYW55IG9wZW4gd29ya2Vyc1xuICAgIHRoaXMuc3RvcChuYW1lKTtcbiAgfVxufVxuXG4vLyBleHBvc2UgYnRocmVhZHMgKHVzZWZ1bCBmb3IgdGVzdHMpXG4vLyBodHRwczovL2dpdGh1Yi5jb20vY2hqai9idGhyZWFkcyNhcGlcbkJyZWUudGhyZWFkcyA9IHtcbiAgYmFja2VuZDogdGhyZWFkcy5iYWNrZW5kLFxuICBicm93c2VyOiB0aHJlYWRzLmJyb3dzZXIsXG4gIGxvY2F0aW9uOiB0aHJlYWRzLmxvY2F0aW9uLFxuICBmaWxlbmFtZTogdGhyZWFkcy5maWxlbmFtZSxcbiAgZGlybmFtZTogdGhyZWFkcy5kaXJuYW1lLFxuICByZXF1aXJlOiB0aHJlYWRzLnJlcXVpcmUsXG4gIHJlc29sdmU6IHRocmVhZHMucmVzb2x2ZSxcbiAgZXhpdDogdGhyZWFkcy5leGl0LFxuICBjb3JlczogdGhyZWFkcy5jb3Jlc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCcmVlO1xuIl19
