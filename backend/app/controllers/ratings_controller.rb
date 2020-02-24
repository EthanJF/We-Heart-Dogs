class RatingsController < ApplicationController

    def index
        render json: Rating.all
    end
    
    def show
        rating = Rating.find(params[:id])
        render json: rating
    end

    def update
        rating = Rating.find(params[:id])
    if rating.update(ratings_params)
       render json: rating
    else 
      render json: rating.errors, status: :unprocessable_entity
      end
    end

    private

    def ratings_params
        params.require(:rating).permit(:value)
    end
end
