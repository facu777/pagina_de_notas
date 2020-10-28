const notesCtrl = {};

// Models
const Note = require("../models/Note");

notesCtrl.renderNoteForm = (req, res) => {
  
  res.render("notes/new-note");
};

notesCtrl.createNewNote = async (req, res) => {
    const { title, description,img } = req.body;
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    if (img){newNote.img = img}
    console.log(newNote.img)
    await newNote.save();
    req.flash('success_msg','Note added succesfully');
    res.redirect("/notes");
};

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({createdAt: 'desc'})
  res.render("notes/all-notes", { notes });
};
notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).then(result => {
    return(result)
    })
  .catch(err => {
    res.sendStatus(404).send("Link Not Found")
  });
  if (note.user != req.user.id){
      req.flash('error_msg','not authorized')
      return res.redirect('/notes')
  }
  console.log(note.id)
  res.render("notes/edit-note", { note });
};

notesCtrl.updateNote = async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash('success_msg','updated note')
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg','deleted note')
  res.redirect("/notes");
};

module.exports = notesCtrl;