$("#update_code").submit(function (event) {
  event.preventDefault();
  var data = document.forms["myform"]["value"].value;
  var path = window.location.pathname;
  var id = path.split("/")[1];
  console.log("code", data);
  var request = {
    url: `http://localhost:3000/${id}/update`,
    method: "PUT",
    data: { newData: data },
  };
  $.ajax(request).done(function (response) {
    console.log(response._id);
    var id = response._id;
    window.location = `http://localhost:3000/${id}`;
  });
});
