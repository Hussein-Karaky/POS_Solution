function DataModel() {};
DataModel.construct();

function TutorEducation(id = null, tutorId = null, institute = null, major = null, degreeId = null) {
    DataModel.call(this, _({ id }));
    this.id = id;
    this.tutorId = tutorId;
    this.institute = institute;
    this.major = major;
    this.degreeId = degreeId;
};
TutorEducation.extends(DataModel);
TutorEducation.construct();
TutorEducation.setUniqueKey("id");
