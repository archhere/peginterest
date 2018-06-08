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
j=Board.create(title: "The splendor of Rivendell",description: "Being immortal, Elves will continue to live in the world until its completion.",author_id: d.id)
k=Board.create(title: "The amazing Shire",description: "We are the lucky Hobbits who live in Shire",author_id: a.id)
l=Board.create(title: "The darkness at Misty Mountains",description: "If you never want to live in a sunless zone and get scaly and amazing like me, come here. Plz bring the ring",author_id: c.id)
m=Board.create(title: "Places to hide from the ring wraits",description: "Be sure to bring Sam Gangee along. He can be handy when things go wrong.",author_id: a.id)


Peg.destroy_all
Peg.create(title:"My home",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465262/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-1.jpg")
Peg.create(title:"Our meadows",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465295/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-3.jpg")
Peg.create(title:"What a beautiful view!",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465304/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-4.jpg")
