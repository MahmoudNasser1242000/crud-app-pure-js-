var siteName = document.getElementById("site-name");
var siteUrl = document.getElementById("site-url");
var searchUrl = document.getElementById("search-url");
var addWebsites = document.getElementById("add-sites");

var tableBody = document.getElementById("t-body");

var errorModal = document.getElementById("error-modal");
var errorInfo = document.getElementById("error-info");
var closeError = document.getElementById("close-error");

var websites;
if (localStorage.getItem("websites")) {
    websites = JSON.parse(localStorage.getItem("websites"));
    showWebsites(websites);
} else {
    websites = [];
}
// ======Another Way 1======
// var websites = JSON.parse(localStorage.getItem("websites")) || [];
// ======Another Way 2======
// var websites = localStorage.getItem("websites")? JSON.parse(localStorage.getItem("websites")) : [];

// for update website
var update = false;
var indexUpdate;

//validation for site name and url
siteName.addEventListener("keyup", function () {
    if (siteName.value.length < 3) {
        siteName.classList.add("is-invalid");
        siteName.classList.remove("is-valid");
    } else {
        siteName.classList.add("is-valid");
        siteName.classList.remove("is-invalid");
    }
    siteName.classList.remove("site-field");
});

var regexp =/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
siteUrl.addEventListener("keyup", function () {
    if (!regexp.test(siteUrl.value)) {
        siteUrl.classList.add("is-invalid");
        siteUrl.classList.remove("is-valid");
    } else {
        siteUrl.classList.add("is-valid");
        siteUrl.classList.remove("is-invalid");
    }
    siteUrl.classList.remove("site-field");
});

// clear inputs
function clearInputs() {
    siteName.value = "";
    siteUrl.value = "";
}

// add or update website
addWebsites.addEventListener("click", function (e) {
    e.preventDefault();

    //show validation error
    if (siteName.value.length < 3 || !regexp.test(siteUrl.value)) {
        errorModal.classList.add("show-modal");
        errorInfo.classList.add("show-error-info");
        document.body.style.overflowY = "hidden";
    } else {
        if (update === false) { //add data
            var website = {
                name: siteName.value,
                url: siteUrl.value,
            };
            websites.push(website);
            addToStorage();
        } else { //update data
            var newInfo = {
                name: siteName.value,
                url: siteUrl.value,
            };
            websites[indexUpdate] = newInfo;
            // ======Another Way======
            // websites.splice(indexUpdate, 1, newInfo);

            addToStorage();

            update = false;
            addWebsites.innerText = "Add Website";
        }

        showWebsites(websites);
        clearInputs();
    }
});

//close validation error
function closeModalError() {
    errorModal.classList.remove("show-modal");
    errorInfo.classList.remove("show-error-info");
    document.body.style.overflowY = "visible";
}
closeError.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModalError();

    // ======Another Way======
    // if (e.target.id === "close-error") {
    //     closeModalError();
    // }
});
errorModal.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModalError();

    // ======Another Way======
    // if (e.target.id === "error-modal") {
    //     closeModalError();
    // }
});
errorInfo.addEventListener("click", function (e) {
    e.stopPropagation();
});

//show websites
function showWebsites(list, term) {
    var container = ``;
    if (list.length === 0) {
        container = `<tr>
                        <td colspan="4">
                            <div class="alert alert-warning w-100" role="alert">
                                There are no websites here ...
                            </div>
                        </td>
                    </tr>`;
    } else {
        for (let i = 0; i < list.length; i++) {
            container += `<tr>
                            <td>${i + 1}</td>
                            <td>${term
                    ? list[i].name
                        .toLowerCase()
                        .replace(
                            term,
                            `<span class="text-success fw-bold">${term}</span>`
                        )
                    : list[i].name
                }</td>
                            <td>
                                <a class="btn btn-info text-white" href="${list[i].url
                }" target="_blank" role="button">
                                    <i class="fa-solid fa-eye"></i>
                                    Visit
                                </a>
                            </td>
                            <td>
                                <button type="button" onclick="updateSite(${i})" class="btn btn-warning rounded-1 mb-2 mb-sm-0">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    Update
                                </button>
                                <button type="button" onclick="deleteSite(${i})" class="btn btn-danger rounded-1">
                                    <i class="fa-solid fa-trash"></i>
                                    Delete
                                </button>
                            </td>
                        </tr>`;
        }
    }

    tableBody.innerHTML = container;
}
// showWebsites(websites);

//delete website
function deleteSite(index) {
    websites.splice(index, 1);
    addToStorage();

    showWebsites(websites);
}

//update website
function updateSite(index) {
    siteName.value = websites[index].name;
    siteUrl.value = websites[index].url;

    update = true;
    indexUpdate = index;

    addWebsites.innerText = "Update website";
}

//search for a website
searchUrl.addEventListener("keyup", function () {
    var searchValue = searchUrl.value.toLowerCase();
    var searchList = [];
    for (let i = 0; i < websites.length; i++) {
        if (websites[i].name.toLowerCase().includes(searchValue)) {
            searchList.push(websites[i]);
        }
    }
    showWebsites(searchList, searchValue);
});


//store our data in localstorage
function addToStorage() {
    localStorage.setItem("websites", JSON.stringify(websites));
}