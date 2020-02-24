class LikesController < ApplicationController
    def index
        render json: Like.all
    end
    
    def show
        like = Like.find(params[:id])
        render json: like
    end

    def create
        like = Like.create(likes_params)
        render json: like
      end
    
    
    
    private
    
    def likes_params
        params.require(:like).permit(:dog_id)
    end
end
