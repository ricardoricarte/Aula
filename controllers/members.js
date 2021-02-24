const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')

exports.index = function(req, res) {
    return res.render("instructors/index", {instructors: data.instructors})
}
// show
exports.show = function (req, res) {

    const { id } = req.params

    const foundMember = data.instructors.find(function (instructor) {
        return id == instructor.id
    })

    if (!foundMember) return res.send("Member notFound!!")


    const instructor = {
        ...foundMember,
        age: age(foundMember.birth),

    }


    return res.render("instructors/show", { instructor })
}

exports.create = function(req, res) {
    return res.render('members/create')
}
// post
exports.post = function (req, res) {

    // data validation structure - if the fields are not filled send notification "please fill in the fields correctly"
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('please fill in all fields correctly')
        }
    }

    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,

    })

    // structure for directing or error printing
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
        if (err) return res.send("Write file error")

        return res.redirect("/instructors")
    })

    //return res.send(req.body)
}
// edit
exports.edit = function (req, res) {

    const { id } = req.params

    const foundMember = data.instructors.find(function (instructor) {
        return id == instructor.id
    })

    if (!foundMember) return res.send("Member notFound!!")

    const instructor = {
        ...foundMember,
        birth: date(foundMember.birth)
    }

    return res.render('instructors/edit', { instructor })
}
// put
exports.put = function (req, res) {

    const { id } = req.body
    let index =0

    const foundMember = data.instructors.find(function (instructor, foundIndex) {
        if( id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send("Member notFound!!")

    const instructor = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })
}

exports.delete = function(req, res){
    const {id} = req.body

    const filteredMembers = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors =filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write error!")

        return res.redirect("/instructors")
    })   
}