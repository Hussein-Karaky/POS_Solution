var li = $('.list li[style="display: block;"]'), n = -1, ll = li.length - 1, ci = null;

var Select = function (target, settings, uid) {

    this.target = null;
    this.select = null;
    this.display = null;
    this.list = null;
    this.options = [];
    this.isLarge = false;
    this.value = null;
    this.selected = null;
    this.settings = null;
    this.highlighted = null;
    this.uid = uid;
    this.init(target, settings);
};
Object.defineProperty(Select.prototype, "constructor", {
    configurable: false,
    enumerable: false,
    writable: false,
    value: Select
})
Select.prototype.init = function (target, settings) {
    switch (typeof target) {
        case 'object':
            this.target = target;
            break;
        case 'string':
            this.target = document.querySelector(target);
            break;
    }

    this.settings = this.getSettings(settings);
    this.buildSelect();
    let main = this;
    if (this.target !== null) {
        this.target.addEventListener("focus", function (e) {
            main.select.focus();
        });

    this.target.addEventListener("change", function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (main.selected.getAttribute("data-value") !== this.value) {
            let opt = main.list.querySelector('[data-value="' + this.value + '"]');
            if (opt !== null && opt !== undefined) {
                opt.dispatchEvent(new Event("click"));
            }
        }
    });

    this.target.parentNode.replaceChild(this.select, this.target);
    this.target.style.display = 'none';
    this.select.appendChild(this.target);
    }

    document.addEventListener('click', this.handleClickOff.bind(this));
    this.positionList();
};

Select.prototype.buildSelect = function () {
    this.select = document.createElement('div');
    this.select.setAttribute("data-rel", this.uid);
    this.select.classList.add('select');
    if (this.target !== null) {
        this.select.setAttribute('tabindex', this.target.tabIndex);
    }
    this.select.addEventListener('keydown', this.handleSelectKeydown.bind(this));

    this.display = document.createElement('span');
    this.display.classList.add('value');
    if (this.target !== null && this.target.options !== null && this.target.options !== undefined && this.target.options.length) {
        let selectedOption = this.target.options[this.target.selectedIndex];
        if (selectedOption !== null && selectedOption.classList.length > 0) {
            selectedOption.classList.forEach(cls => this.display.classList.add(cls));
        }
    }
    this.display.addEventListener('click', this.handleDisplayClick.bind(this));
    let main = this;
    this.display.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {
            //e.preventDefault();
            main.toggleList()
        }
    });
    this.select.appendChild(this.display);

    this.buildList();

    if (this.options.length) {
        this.value = this.options[this.target.selectedIndex].getAttribute('data-value');
        this.selected = this.options[this.target.selectedIndex];
        this.display.innerHTML = this.selected.innerHTML;
    }

    if (
        (this.settings.filtered === 'auto' && this.options.length >= this.settings.filter_threshold) ||
        this.settings.filtered === true
    ) {
        this.isLarge = true;
        this.select.classList.add('large');
        if (this.target !== null) {
            this.target.classList.forEach(cls => this.select.classList.add(cls));
        }

    }

};

Select.prototype.buildList = function () {
    this.list = document.createElement('div');
    this.list.classList.add('list');
    if (this.target !== null) {
        this.target.classList.forEach(cls => this.list.classList.add(cls));
    }
    this.list.setAttribute('tabindex', '-1');
    this.list.addEventListener('keydown', this.handleListKeydown.bind(this));
    this.list.addEventListener('mouseenter', function () {
        this.options[this.highlighted].classList.remove('hovered');
    }.bind(this));

    this.highlighted = this.target !== null ? this.target.selectedIndex : 0;
    this.buildFilter();
    this.buildOptions();

    this.select.appendChild(this.list);
};

Select.prototype.buildFilter = function () {
    var wrapper = document.createElement('div');
    wrapper.classList.add('filter');

    this.filter = document.createElement('input');
    this.filter.type = 'text';
    this.filter.setAttribute('placeholder', this.settings.filter_placeholder);
    this.filter.addEventListener('keyup', this.handleFilterKeyup.bind(this));

    wrapper.appendChild(this.filter);
    this.list.appendChild(wrapper);
};

Select.prototype.buildOptions = function () {
    var ul = document.createElement('ul');
    ul.classList.add("ul-select");
    if (this.target !== null) {
        var options = this.target.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('data-value', options[i].value);
            li.classList.add("li-select");
            if (options[i].classList.length > 0) {
                options[i].classList.forEach(cls => li.classList.add(cls));
            }
            li.innerHTML = options[i].innerHTML;
            li.addEventListener('click', this.handleOptionClick.bind(this));

            ul.appendChild(li);
            this.options.push(li);
        }
    }
    this.list.appendChild(ul);
};

Select.prototype.toggleList = function () {
    if (this.list.classList.contains('open')) {
        this.list.classList.remove('open');
        this.options[this.highlighted].classList.remove('hovered');
        this.select.focus();
    } else {
        let selectedOpt = this.options[this.target.selectedIndex];
        if (selectedOpt !== undefined) {
            selectedOpt.classList.add('hovered');
        }
        this.highlighted = this.target.selectedIndex;
        this.list.classList.add('open');
        //        this.list.focus();
        this.filter.focus();
    }
};

Select.prototype.positionList = function () {
    if (!this.isLarge && this.selected !== null) {
        this.list.style.top = '-' + this.selected.offsetTop + 'px';
    }
};

Select.prototype.highlightOption = function (dir) {
    var next = null;
    switch (dir) {
        case 'up':
            next = (this.highlighted - 1 < 0) ? this.highlighted : this.highlighted - 1;
            break;
        case 'down':
            next = (this.highlighted + 1 > this.options.length - 1) ? this.highlighted : this.highlighted + 1;
            break;
        default:
            next = this.highlighted;
    }
    this.options[this.highlighted].classList.remove('hovered');
    this.options[next].classList.add('hovered');
    this.highlighted = next;
};

Select.prototype.clearFilter = function () {
    this.filter.value = '';

    for (var i = 0; i < this.options.length; i++) {
        this.options[i].style.display = 'block';
    }
};

Select.prototype.closeList = function () {
    this.list.classList.remove('open');
    let hOption = this.options[this.highlighted];
    if (hOption !== undefined) {
        hOption.classList.remove('hovered');
    }
};

Select.prototype.getSettings = function (settings) {
    var defaults = {
        filtered: 'auto',
        filter_threshold: 8,
        filter_placeholder: 'Filter options...'
    };

    for (var p in settings) {
        defaults[p] = settings[p];
    }

    return defaults;
};

// EVENT HANDLERS

Select.prototype.handleSelectKeydown = function (e) {
    if (this.select === document.activeElement && e.keyCode === 32) {
        this.toggleList();
    }
};

Select.prototype.handleDisplayClick = function (e) {
    this.list.classList.add('open');

    if (this.isLarge) {
        this.filter.focus();
        this.options.forEach(opt => $(opt).removeClass('li-selected blue white-text'));
        n = this.target.selectedIndex;
        ci = li.get(n);
        $(ci).addClass('li-selected blue white-text');
        scrollParentToChild($('.ul-select')[0], ci);
    }
};

Select.prototype.handleListKeydown = function (e) {
    if (this.list === document.activeElement) {
        switch (e.keyCode) {
            case 38:
                this.highlightOption('up');
                break;
            case 40:
                this.highlightOption('down');
                break;
            case 13:
                this.target.value = this.options[this.highlighted].getAttribute('data-value');
                this.selected = this.options[this.highlighted];
                this.display.innerHTML = this.options[this.highlighted].innerHTML;
                this.closeList();
                setTimeout(this.positionList.bind(this), 200);
                this.select.focus();
                break;
        }
    }
};

Select.prototype.handleFilterKeyup = function (e) {
    li = $('.list li[style="display: block;"]');
    ll = li.length - 1;
    var self = this;
    var x = e.which;
    li.removeClass('li-selected blue white-text');
    if (x === 40 || x === 39 || x === 38 || x === 37) {
        if (x === 40 || x === 39) {
            n++;
            if (n > ll) {
                n = 0;
            }
        }
        else if (x === 38 || x === 37) {
            n--;
            if (n < 0) {
                n = ll;
            }
        }
        ci = li.get(n);
        $(ci).addClass('li-selected blue white-text');
        scrollParentToChild($('.ul-select')[0], ci);
        $(this).val($(ci).text());
    } else if (x === 13 && ci !== null) {
        $(ci).click();
    }

    //if (e.keyCode === 40) {
    //    $($(".select .list li[style='display: block;']")[0]).focus().addClass("active");
    //    return false;
    //}
    this.options.filter(function (li) {
        //if(li.innerHTML.substring(0, self.filter.value.length).toLowerCase() == self.filter.value.toLowerCase()) {
        if (li.innerHTML.toLowerCase().includes(self.filter.value.toLowerCase())) {
            li.style.display = 'block';
        } else {
            li.style.display = 'none';
        }
    });
};

Select.prototype.handleOptionClick = function (e) {
    this.display.innerHTML = e.target.innerHTML;
    this.target.value = e.target.getAttribute('data-value');
    this.value = this.target.value;
    this.selected = e.target;

    this.closeList();
    this.clearFilter();
    n = -1; ll = li.length - 1; ci = null;
    this.target.dispatchEvent(new Event("change"));
    setTimeout(this.positionList.bind(this), 200);
    if (this.options.length) {
        this.display.className = "value";
        let selectedOption = this.target.options[this.target.selectedIndex];
        if (selectedOption !== null && selectedOption !== undefined && selectedOption.classList.length > 0) {
            selectedOption.classList.forEach(cls => this.display.classList.add(cls));
        }
    }
};

Select.prototype.handleClickOff = function (e) {
    if (!this.select.contains(e.target)) {
        this.closeList();
    }
};

Select.prototype.setValue = function (value) {
    if (value > -1) {
        let opt = this.list.querySelector('[data-value="' + this.value + '"]');
        if (opt !== null && opt !== undefined) {
            opt.dispatchEvent(new Event("click"));
        }
    }
};