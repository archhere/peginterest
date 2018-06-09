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
n=Board.create(title: "All my lovely experiences",description: "Evil exists in this world, but it is nonetheless a beautiful world.Savor it.",author_id: b.id)


Peg.destroy_all
Peg.create(title:"My home",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465262/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-1.jpg")
Peg.create(title:"The most delicious oranges from Bilbo's garden",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528587113/random%20pics%20for%20dashboard/rawpixel-597446-unsplash.jpg")
Peg.create(title:"I love sleeping here",author_id:c.id,board_id:l.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528586939/random%20pics%20for%20dashboard/milos-prelevic-508498-unsplash.jpg")
Peg.create(title:"Our meadows",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465295/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-3.jpg")
Peg.create(title:"What a beautiful view!",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528465304/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/shire-4.jpg")
Peg.create(title:"I love this",author_id:d.id,board_id:j.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528482537/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/jeffrey-workman-19042-unsplash.jpg")
Peg.create(title:"This is heaven on earth",author_id:d.id,board_id:j.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528482367/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/keghan-crossland-42934-unsplash.jpg")
Peg.create(title:"I love sunsets",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528586800/random%20pics%20for%20dashboard/anton-repponen-99530-unsplash.jpg")
Peg.create(title:"Autumn blossom",author_id:d.id,board_id:j.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528482466/profile_pics/board%20-%20splendor%20of%20Rivendell/board-shire/anton-darius-thesollers-424266-unsplash.jpg")
Peg.create(title:"Delicious fish here",author_id:c.id,board_id:l.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528483977/misty_mountain/anthony-delanoix-21383-unsplash.jpg")
Peg.create(title:"I live right here",author_id:c.id,board_id:l.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528483852/misty_mountain/philippe-toupet-320689-unsplash.jpg")
Peg.create(title:"The prittiest river i have seen",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528553619/gandalf/leo-rivas-25956-unsplash.jpg")
Peg.create(title:"My lovely horses",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528554068/gandalf/raphael-wicker-94290-unsplash.jpg")
Peg.create(title:"This is a typical hobbit breakfast",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528553763/gandalf/luke-michael-27050-unsplash.jpg")
Peg.create(title:"I took this in Sam Gangee's backyard.He is so lucky to live here",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528553653/gandalf/joey-kyber-91823-unsplash.jpg")
Peg.create(title:"My secret cabin",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528553582/gandalf/luca-bravo-121932-unsplash.jpg")
Peg.create(title:"Best things on earth",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528587100/random%20pics%20for%20dashboard/sergey-shmidt-229811-unsplash.jpg")
Peg.create(title:"Flowers in my garden",author_id:a.id,board_id:k.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528587142/random%20pics%20for%20dashboard/candice-seplow-154043-unsplash.jpg")
Peg.create(title:"My pet butterfly",author_id:d.id,board_id:j.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528587152/random%20pics%20for%20dashboard/boris-smokrovic-145963-unsplash.jpg")
Peg.create(title:"Who woke me up now?",author_id:c.id,board_id:l.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528586978/random%20pics%20for%20dashboard/saffu-201118-unsplash.jpg")
Peg.create(title:"I created this field",author_id:d.id,board_id:j.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528586887/random%20pics%20for%20dashboard/scott-goodwill-359328-unsplash.jpg")
Peg.create(title:"Off to a new adventure",author_id:b.id,board_id:n.id,image_url:"https://res.cloudinary.com/archhere/image/upload/v1528587126/random%20pics%20for%20dashboard/jeremy-bishop-184462-unsplash.jpg")
