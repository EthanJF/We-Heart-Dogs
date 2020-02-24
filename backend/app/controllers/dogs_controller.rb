class DogsController < ApplicationController
    def index
        dogs = Dog.all
        render json: dogs.to_json(:include => {
      :rating => {:only => [:id, :dog_id, :value]},
      :comments => {:only => [:id, :dog_id, :author, :content]},
      :likes => {:only => [:id, :dog_id]}
    })
    end

    def show
      dog = Dog.find(params[:id])
      render json: dogs.to_json(:include => {
        :rating => {:only => [:id, :dog_id, :value]},
        :comments => {:only => [:id, :dog_id, :author, :content]},
        :likes => {:only => [:id, :dog_id]}
      })
    end

    def update
      dog = Dog.find(params[:id])
      if dog.update(dog_params)
        render json: dogs.to_json(:include => {
          :rating => {:only => [:id, :dog_id, :value]},
          :comments => {:only => [:id, :dog_id, :author, :content]},
          :likes => {:only => [:id, :dog_id]}
        })
      else
      render json: dog.errors, status: :unprocessable_entity
      end
      
    end

    private

    def dog_params
      params.require(:dog).permit(:image_url)
    end
end


