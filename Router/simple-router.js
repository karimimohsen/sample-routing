class SimpleRouter {
    constructor(location) {
        this.routes = [];
        this.location = location;
        this.root = '/';

        window.onpopstate = function (event) {
            console.log('event' + event);
        };
    }

    getFragment() {
        let fragment = '';
        fragment = this.clearSlashes(decodeURI(this.location.pathname + this.location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;

        return this.clearSlashes(fragment);
    }

    clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    add(re, handler) {
        if (typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({ re: re, handler: handler });
        return this;
    }

    remove(param) {
        for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
            if (r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    }

    flush() {
        this.routes = [];
        this.root = '/';
        return this;
    }

    check(f) {
        var fragment = f || this.getFragment();
        for (var i = 0; i < this.routes.length; i++) {
            var match = fragment.match(this.routes[i].re);
            if (match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }
        }
        return this;
    }

    listen() {
        var self = this;
        var current = self.getFragment();
        var fn = function () {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    }

    navigate(path) {
        path = path ? path : '';
        history.pushState(null, null, this.root + this.clearSlashes(path));
        return this;
    }
}