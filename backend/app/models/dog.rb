class Dog < ApplicationRecord
has_one :rating
has_many :comments
has_many :likes
end
