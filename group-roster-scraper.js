// Determine the graduating year of the present senior class.
// Take the present year if between January and May, otherwise next year.
var now = new Date();
var SeniorClassYear = now.getFullYear();
if( now.getMonth() >= 5/*June*/ ){
  SeniorClassYear++;
}
var YoungestClassYear = SeniorClassYear + 12;
SeniorClassYear = SeniorClassYear % 100;
YoungestClassYear = YoungestClassYear % 100;


// Regex that will only match names with a graduating year (e.g. '18)
// Must still check the year though because Alumns have the year as 
// well as present students.
var StudentTitleRegex = /.+?\'\d{2}/;



function forEachStudent(doSomething){
  // Retrieve all elements containing info for a contact.
  var contacts = document.querySelectorAll('#RosterCardContainer .contactWell .margin-left-20');

  for( var i = 0; i < contacts.length; i++ ){
    // c is the DOM element for a single contact in the group
    var c = contacts[i];

    // The title contains the name and graduating year (e.g. Ted Lorts '08)
    var cTitle = c.querySelector('h3').textContent;
    var matches = cTitle.match(StudentTitleRegex);

    // Just ignore the contact if it doesn't match.
    if( matches ){
      // The index of the tick (') leads us to the year and the end of the name
      var iTick = cTitle.indexOf("'");
      var name = cTitle.substring(0, iTick - 1);
      var year = parseInt( cTitle.substring(1 + iTick) );

      // Only take present students between grades 1 and 12.
      if( YoungestClassYear >= year && year >= SeniorClassYear ) {
        doSomething(c, name, year);
      }
    }
  }
}



// First, open all the relation lists for the pertinent students.
forEachStudent(function(contactElement){
  // We have to "click" this button to show the parents.
  var relBtn = contactElement.querySelector('.hidden-mobile-card');
  // But not every contact card has this button available.
  if( relBtn ){
    // Click it to open that div if it's not already open
    if( !relBtn.classList.contains('user-relationships-expanded') ){
      relBtn.click();
    }
  }
});


// Now populate the student array, reading parent data if there
var students = [];
var maxNParents = 0;
window.setTimeout(function(){
  document.body.style.background = '';

  forEachStudent(function(contactElement, name, year){
    var parents = [];

    var relBtn = contactElement.querySelector('.hidden-mobile-card');
    if( relBtn ){
      // Use this number from the button's href to find the div containing the
      // actual parent/relation data.
      var relId = relBtn.getAttribute('href').substring(1);

      // Now look at each row representing a relation to this student.
      var parentRows = document.querySelector('#relate_region_'+relId).querySelectorAll('tr');

      for( var j = 0; j < parentRows.length; j++ ){
        var content = parentRows[j].textContent;
        var iParent = content.indexOf('(Parent)');
        parents.push({
          name: content.substring(0, iParent - 1),
          email: content.substring(iParent + 8),
        });
      }
    }

    var iLastSpace = name.lastIndexOf(' ');
    students.push({
      firstName: name.substring(0, iLastSpace),
      lastName: name.substring(iLastSpace + 1),
      classYear: year,
      parents: parents,
    });

    maxNParents = Math.max(maxNParents, parents.length);
  });

  var SEP = '\t';
  console.log('Last Name'+SEP+'First Name'+SEP+'Class'+SEP+'Parent A email'+SEP+'Parent B email'+SEP+'Parent C email'+SEP+'Parent A name'+SEP+'Parent B name'+SEP+'Parent C name');
  students.forEach(function(student){
    var line = student.lastName + SEP + student.firstName + SEP + student.classYear;
    var parents = student.parents;
    for( var i = 0; i < maxNParents; i++ ){
      line += SEP;
      if( i < parents.length ){
        line += parents[i].email;
      }
    }
    for( i = 0; i < maxNParents; i++ ){
      line += SEP;
      if( i < parents.length ){
        line += parents[i].name;
      }
    }
    console.log(line);
  });

}, 5000);

document.body.style.background = 'grey';