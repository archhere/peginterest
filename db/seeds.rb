# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
a = User.create(email: "frodo@shire.com",password: "password",firstname: "Frodo",lastname: "Baggins",image_url: "https://s33.postimg.cc/ko7rqjhzz/Frodo-_Baggins-frodo-7808598.jpg")
b = User.create(email: "gandalf@shire.com",password: "password",firstname: "Gandalf",lastname: "The Gray",image_url: "https://s33.postimg.cc/yvxgezkcf/gandalf.jpg")
c = User.create(email: "gollum@shire.com",password: "password",firstname: "Gollum",lastname: "Sméagol",image_url: "https://s33.postimg.cc/52qg6dvpb/472144.png")
d = User.create(email: "galadriel@goldenwood.com",password: "password",firstname: "Galadriel",lastname: "Alatáriel",image_url: "https://s33.postimg.cc/m4ja8u5j3/Lady_Galadriel.jpg")



Board.destroy_all
Board.create(title: "The splendor of Rivendell",description: "Being immortal, Elves will continue to live in the world until its completion.",author_id: d.id)
Board.create(title: "The amazing Shire",description: "Hobbits are the unusual creatures who live in Shire",author_id: b.id)
Board.create(title: "The darkness at Misty Mountains",description: "If you never want to live in a sunless zone and get scaly and amazing like me, come here. Plz bring the ring",author_id: c.id)
Board.create(title: "Places to hide from the ring wraits",description: "Be sure to bring Sam Gangee along. He can be handy when things go wrong.",author_id: a.id)
