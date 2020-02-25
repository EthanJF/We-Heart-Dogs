Comment.destroy_all
Like.destroy_all
Rating.destroy_all
Dog.destroy_all

parsedDogs = JSON.parse(File.read('cuteemergency.json'))
parsedDogs2 = JSON.parse(File.read('cutestpetdogs.json'))

newDogs = parsedDogs.select do |dog|
    dog.extend Hashie::Extensions::DeepFind
    dog.deep_find("media_url")
end

newDogs.each do |dog|
    dog.extend Hashie::Extensions::DeepFind
    Dog.create(image_url: dog.deep_find("media_url"))
end

newDogs2 = parsedDogs2.select do |dog|
    dog.extend Hashie::Extensions::DeepFind
    dog.deep_find("media_url")
end

newDogs2.each do |dog|
    dog.extend Hashie::Extensions::DeepFind
    Dog.create(image_url: dog.deep_find("media_url"))
end

Dog.all.each do |dog|
    5.times do
    Rating.create(value:rand(10..20), dog_id: dog.id)
    end
end

adjectives = ["cute", "adorable", "beautiful", "sweet","goofy","attractive", "handsome", "precious", "cuddly", "beloved", "big", "smol", "furry", "fuzzy", "dashing", "good", "gorgeous", "huggable", "perfect", "pretty", "regal", "scruffy", "shiny", "sleek", "soft", "snuggly", "wonderful"]

Dog.all.each do |dog|
    i  = rand(2)
    i.times do
    Comment.create(author:Faker::Name.first_name, content:"This #{adjectives.sample} pupper goes #{Faker::Creature::Dog.sound}.", dog_id: dog.id)
    end
end

Dog.all.each do |dog|
    i  = rand(2)
    i.times do
    Comment.create(author:Faker::Name.first_name, content:"I love this #{adjectives.sample} doggo.", dog_id: dog.id)
    end
end

Dog.all.each do |dog|
    i  = rand(2)
    i.times do
    Comment.create(author:Faker::Name.first_name, content:"What a #{adjectives.sample} pooch.", dog_id: dog.id)
    end
end

Dog.all.each do |dog|
    i  = rand(2)
    i.times do
    Comment.create(author:Faker::Name.first_name, content:Faker::Creature::Dog.meme_phrase, dog_id: dog.id)
    end
end

Dog.all.each do |dog|
    i  = rand(2)
    i.times do
    Comment.create(author:Faker::Name.first_name, content:"I would die for this #{adjectives.sample} dog.", dog_id: dog.id)
    end
end

Dog.all.each do |dog|
    i  = rand(1..20)
    i.times do
        Like.create(dog_id:dog.id)
    end
end

puts "Seeded!"
