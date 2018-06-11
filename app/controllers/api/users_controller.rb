class Api::UsersController < ApplicationController

  # before_action :require_login, only: [:edit, :update, :destroy]

  def create
    @user = User.new(user_params)

    if @user.save
      login(@user)
      render "api/users/show"
    else
      render json: @user.errors.full_messages, status: 422
    end
  end


  def update
    @user = User.find(current_user.id)

    if @user.update(user_params)
      login(@user)
      render "api/users/show"
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end


  private

  def user_params
    params.require(:user).permit(:username, :password,:firstname,:lastname,:email,:image_url)
  end
end
