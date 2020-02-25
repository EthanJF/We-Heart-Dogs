class Dog < ApplicationRecord
has_many :ratings
has_many :comments
has_many :likes
end
