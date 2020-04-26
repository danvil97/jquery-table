var itemsObject = [{
        id: 1,
        name: "bbbbb",
        email: 'King@Krule.uk',
        count: 10,
        price: "$ 100.00",
        delivery: {
            Russia: [true, true, false],
            Belorus: [true, true, true],
            USA: [true, true, true]
        }
    },
    {
        id: 2,
        name: "ccccc",
        email: 'kek@yandex.ru',
        count: 15,
        price: "$ 75.00",
        delivery: {
            Russia: [true, true, true],
            Belorus: [true, true, true],
            USA: [true, true, true]
        }
    },
    {
        id: 3,
        name: "aaaaa",
        email: '12345@yandex.ru',
        count: 200,
        price: "$ 300.00",
        delivery: {
            Russia: [true, true, true],
            Belorus: [false, false, false],
            USA: [false, false, false]
        }
    }
];
var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

if (localStorage.getItem("itemJSON")) {
    itemsObject = JSON.parse(localStorage.getItem("itemJSON"));
} else {
    localStorage.setItem("itemJSON", JSON.stringify(itemsObject));
};

function showInfoModal(type, obj) {
    switch (type) {
        case "add":
            fillForm();
            $(".modalWrap").css('display', 'flex');
            $(".modalProductInfo").show();
            break;
        case "info":
            fillForm(obj, obj.name, obj.email, obj.count, obj.price, "edit");
            $(".modalWrap").css('display', 'flex');
            $(".modalProductInfo").show();
            break;
    }
}

function convertNumber(num) {
    var newnum = num.replace(/[$\s,]*/g, "");
    return newnum;
}

function closeInfoModal() {
    $(".modalWrap").hide();
    $(".modalProductInfo").hide();
    fillForm();
}

function showDeleteModal(id) {
    $(".deleteItemTitle")[0].innerHTML = itemsObject[getItemIndex(id)].name;
    $(".modalWrap").css('display', 'flex');
    $(".modalSure").show();
    $(".deleteItemYes").data("itemid", id);
}

function closeDeleteModal() {
    $(".modalWrap").hide();
    $(".modalSure").hide();
}

function getNewItemId() {
    var id = 1;
    itemsObject.forEach(el => {
        if (el.id == id) {
            id++;
        }
    });
    return id;
}

function fillForm(obj, name = "", email = "", count = "", price = "", type = "") {
    $("#nameIn")[0].value = name;
    $("#emailIn")[0].value = email;
    $("#countIn")[0].value = count;
    $("#priceIn")[0].value = price;
    if (obj) {
        $(".rusCity").each((i, el) => {
            obj.delivery.Russia[i] ? el.checked = true : el.checked = false;
        });
        $(".belCity").each((i, el) => {
            obj.delivery.Belorus[i] ? el.checked = true : el.checked = false;
        });
        $(".usaCity").each((i, el) => {
            obj.delivery.USA[i] ? el.checked = true : el.checked = false;
        });
    } else {
        $(".rusCity").each((i, el) => {
            el.checked = false;
        });
        $(".belCity").each((i, el) => {
            el.checked = false;
        });
        $(".usaCity").each((i, el) => {
            el.checked = false;
        });
    }

    if (type == "edit") {
        $(".saveButton").attr("save-type", "edit");
        $(".saveButton").attr("save-id", obj.id);
    } else {
        $(".saveButton").attr("save-type", "add");
    }
}

function addItem(name, email, count, price) {
    var obj = {
        id: getNewItemId(),
        name,
        email,
        count,
        price,
        delivery: {
            "Russia": [],
            "Belorus": [],
            "USA": []
        }
    };
    $(".rusCity").each((i, el) => {
        el.checked ? obj.delivery.Russia.push(true) : obj.delivery.Russia.push(false);
    });
    $(".belCity").each((i, el) => {
        el.checked ? obj.delivery.Belorus.push(true) : obj.delivery.Belorus.push(false);
    });
    $(".usaCity").each((i, el) => {
        el.checked ? obj.delivery.USA.push(true) : obj.delivery.USA.push(false);
    });
    itemsObject.push(obj);
}

function deleteItem(id) {
    console.log(id);
    itemsObject.splice(itemsObject.findIndex(item => item.id == id), 1);
}

function editItem(id, name, email, count, price) {
    var ind = getItemIndex(id);
    itemsObject[ind].name = name;
    itemsObject[ind].email = email;
    itemsObject[ind].count = count;
    itemsObject[ind].price = price;
    $(".rusCity").each((i, el) => {
        el.checked ? itemsObject[ind].delivery.Russia[i] = true : itemsObject[ind].delivery.Russia[i] = false;
    });
    $(".belCity").each((i, el) => {
        el.checked ? itemsObject[ind].delivery.Belorus[i] = true : itemsObject[ind].delivery.Belorus[i] = false;
    });
    $(".usaCity").each((i, el) => {
        el.checked ? itemsObject[ind].delivery.USA[i] = true : itemsObject[ind].delivery.USA[i] = false;
    });
}
//! Templates

function sortRows(dir) {
    if ($("#arrow").data("col") == "Name") {
        let sortedRows = Array.from($(".table tr")).slice(1).sort((a, b) => a.cells[0].children[0].innerHTML > b.cells[0].children[0].innerHTML ? 1 * dir : -1 * dir);
        $("tbody")[0].append(...sortedRows);
    } else {
        let sortedRows = Array.from($(".table tr")).slice(1).sort((a, b) => Number(convertNumber(a.cells[1].innerHTML)) > Number(convertNumber(b.cells[1].innerHTML)) ? 1 * dir : -1 * dir);
        $("tbody")[0].append(...sortedRows);
    }
}

function createTableRow(item) {
    let rowTemplate = _.template('<tr scope="row" class="itemRow" data-itemid=<%-id%>><td class="align-text-bottom"><a class="btn btn-link btn-sm searchNameTitle" data-itemId="<%-id%>" ><%-name%></a><span class="badge badge-secondary float-right"><%-count%></span></td><td><%-price%></td><td class="d-flex justify-content-around"><button class="btn btn-outline-secondary btn-sm px-3 editButton" data-itemId="<%-id%>">Edit</button><button class="btn btn-outline-secondary btn-sm deleteButton" data-itemId="<%-id%>">Delete</button></td></tr>');
    return rowTemplate(item);
}

function getItemIndex(id) {
    return itemsObject.findIndex(item => item.id == id);
}

function renderTableRows() {
    $("tbody")[0].innerHTML = "";
    itemsObject.forEach(function (item) {
        $("#products").append(createTableRow(item));
    });
    localStorage.setItem("itemJSON", JSON.stringify(itemsObject));

    $(".editButton, .searchNameTitle").bind('click', (ev) => {
        var obj = itemsObject[getItemIndex($(ev.target).data("itemid"))];
        showInfoModal("info", obj);
    });
    $(".deleteButton").click((ev) => {
        console.log(ev.target);
        console.log($(ev.target).data("itemid"));
        showDeleteModal($(ev.target).data("itemid"));
    });

    unsortedRows = Array.from($(".table tr")).slice(1);
}


renderTableRows();
var unsortedRows = Array.from($(".table tr")).slice(1);

$(".deleteItemYes").bind('click', (ev) => {
    console.log(ev.target);
    console.log($(ev.target).data("itemid"));
    deleteItem($(ev.target).data("itemid"));
    closeDeleteModal();
    renderTableRows();
});

$(".modalPICross, .cancelButton").bind('click', (ev) => {
    closeInfoModal();
});

$(".addButton").bind('click', (ev) => {
    showInfoModal("add");
});

$(".saveButton").bind('click', (ev) => {
    if (validateForm()) {
        if ($(ev.target).attr("save-type") == "add") {
            addItem($("#nameIn").val(), $("#emailIn").val(), $("#countIn").val(), $("#priceIn").val());
        } else {
            editItem($(ev.target).attr("save-id"), $("#nameIn").val(), $("#emailIn").val(), $("#countIn").val(), $("#priceIn").val());
        }
        closeInfoModal();
        renderTableRows();
    }
});

$("#searchBox").bind('keyup', (ev) => {
    (ev.keyCode === 13) ? $("#searchButton").click(): false
})

$("#delCountrySel").bind('change', (ev) => {
    switch ($("#delCountrySel").val()) {
        case "":
            $(".cityCheckBoxesClass").hide();
            break;
        case "Russia":
            $(".cityCheckBoxesClass").hide();
            $(".cityRussia").show();
            break;
        case "Belorus":
            $(".cityCheckBoxesClass").hide();
            $(".cityBelorus").show();
            break;
        case "USA":
            $(".cityCheckBoxesClass").hide();
            $(".cityUSA").show();
            break;
    }
});

$(".deleteItemNo").bind('click', () => {
    closeDeleteModal();
});
$("#priceIn").bind('focusout', () => {
    $("#priceIn")[0].value = "$ " + (Number($("#priceIn")[0].value)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
});
$("#priceIn").bind('focusin', () => {
    $("#priceIn")[0].value = "";
});
//TODO Filter

$("#searchButton").bind('click', () => {
    $(".itemRow").hide();
    $(".searchNameTitle:contains(" + $("#searchBox").val() + ")").each((i, el) => {
        $(el.parentElement.parentElement).show();
    });
});
//? Case sensetive search
jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

//TODO Sort
$("th:contains('Name'),th:contains('Price')").bind('click', (ev) => {
    if ($("#arrow").length === 1) {
        if ($("#arrow").data("col") == $(ev.target).data("title")) {
            if ($("#arrow").hasClass("arrowDown")) {
                $("#arrow").toggleClass("arrowDown");
                $("#arrow").toggleClass("arrowUp")
                sortRows(1);
            } else {
                $("#arrow").remove();
                $("tbody")[0].append(...unsortedRows);
            }
        } else {
            $("#arrow").remove();
            $("tbody")[0].append(...unsortedRows);
        }
    } else {
        $(ev.target).append('<div class="arrowDown float-right" id="arrow">&#10144;</div>')
        $("#arrow").attr("data-col", $(ev.target).data("title"));
        sortRows(-1);
    }
});
//TODO Validation
function validateForm() {
    var isValidCount = 0;
    if (($("#nameIn").val().length > 15) || ($("#nameIn").val().length < 5)) {
        $("#nameIn").addClass("is-invalid");
        $("#nameTip").addClass("error");
    } else {
        $("#nameIn").removeClass("is-invalid");
        $("#nameTip").removeClass("error");
        isValidCount++;
    };
    if (!emailReg.test($("#emailIn").val())) {
        $("#emailIn").addClass("is-invalid");
        $("#emailTip").addClass("error");
    } else {
        $("#emailIn").removeClass("is-invalid");
        $("#emailTip").removeClass("error");
        isValidCount++;
    };
    if (($("#countIn").val()) < 0 || ($("#countIn").val() == "")) {
        $("#countIn").addClass("is-invalid");
        $("#countTip").addClass("error");
    } else {
        $("#countIn").removeClass("is-invalid");
        $("#countTip").removeClass("error");
        isValidCount++;
    };
    if (($("#priceIn").val()) < 0 || ($("#priceIn").val() == "")) {
        $("#priceIn").addClass("is-invalid");
        $("#priceTip").addClass("error");
    } else {
        $("#priceIn").removeClass("is-invalid");
        $("#priceTip").removeClass("error");
        isValidCount++;
    }
    return isValidCount == 4 ? true : false;
}