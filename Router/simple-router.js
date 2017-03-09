class SimpleRouter {
    constructor(location, window) {
        this.routes = [];
        this.location = location;
        this.root = '/';

        window.addEventListener('popstate', function (event) {
            if (event.state) {
                console.log('event' + event);
            }
        }, false);
    }

    _clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    _getFragment() {
        let fragment = '';
        fragment = this._clearSlashes(decodeURI(location.pathname + location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;

        return this._clearSlashes(fragment);
    }

    flush() {
        this.routes = [];
        this.root = '/';
        return this;
    }

    add(URI, handler) {
        if (typeof URI == 'function') {
            handler = URI;
            URI = '';
        }
        this.routes.push({ URI: URI, handler: handler });
        return this;
    }

    remove(param) {
        for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
            if (r.handler === param || r.URI.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    }

    check(f) {
        var fragment = f || this._getFragment();
        for (var i = 0; i < this.routes.length; i++) {
            var match = fragment.match(this.routes[i].URI + '(?:\/|$)');
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
        var current = self._getFragment();
        var fn = function () {
            if (current !== self._getFragment()) {
                current = self._getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 150);
        return this;
    }

    navigate(path) {
        path = path ? path : '';
        history.pushState(null, null, this.root + this._clearSlashes(path));
        return this;
    }
}