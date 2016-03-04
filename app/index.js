HTMLTextAreaElement.prototype.getSelection = HTMLInputElement.prototype.getSelection = function() {
    var ss = this.selectionStart;
    var se = this.selectionEnd;
    if (typeof ss === "number" && typeof se === "number") {
        return this.value.substring(this.selectionStart, this.selectionEnd);
    }
    return "";
};

var title = $(".title");
var text = $("textarea");
var reset = $(".reset");

text.on("select", function () {
    search(this.getSelection());
});

text.on("input", function () {
    localStorage.setItem("text", $(this).val());
});

title.on("input", function () {
    localStorage.setItem("title", $(this).val());

});

reset.on("click", function () {
    title.val("");
    text.text("");
});

if (text.val() == "" && title.val() == "") {
    title.val(localStorage.getItem("title") ? localStorage.getItem("title") : "");
    text.text(localStorage.getItem("text") ? localStorage.getItem("text") : "");
}

var search = function (selection) {
    $.ajax({
        "url": "search",
        "data": {"q":selection}
    }).done(function (data) {
        console.log("Search completed");
        displayResults(data);
    });
}

var displayResults = function (results) {
    console.log("Updating react");
    ReactDOM.render(
        <ResourceList resources={results} />,document.getElementsByClassName('resources')[0]
    );
};

class ResourceList extends React.Component {
    render() {
        var resources = this.props.resources.map(function (resource, i) {
            return <Resource key={i} title={resource.title} items={resource.results} />
        });

        return (
            <div className="resourceList">
                <h1>Resources</h1>
                {resources}
            </div>
        )
    }
}

class Resource extends React.Component {
    render() {

        var itemList = this.props.items.map(function (item, i) {
            return (
                <Item key={i} title={item.title} url={item.url} />
            )
        });

        return (
            <div className="resource">
                <h2>{this.props.title}</h2>
                {itemList}
            </div>
        )
    }
}

class Item extends React.Component {
    render() {
        return (
            <div className="item">
                <h3>{this.props.title}</h3>
                <a href={this.props.url}>View</a>
            </div>
        )
    }
}

var resources = [];

ReactDOM.render(
    <ResourceList resources={resources} />,document.getElementsByClassName('resources')[0]
);
