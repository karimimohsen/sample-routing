class SimpleRouter {
    constructor(location) {
        this.routes = [];
        this.location = location;
        this.root = '/';
    }

    getFragment() {
        let fragment = '';
        fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
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
}