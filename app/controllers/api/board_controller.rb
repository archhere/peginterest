class Api::BoardController < ApplicationController
  before_action :require_login
  
    def new
      @board = Board.new
    end

    def create
      @board = Board.new(board_params)
      @board.author_id = current_user.id

      if @board.save
        render :show
      else
        render json: @board.errors.full_messages, status: 422
      end
    end

  def edit
    @board = current_user.boards.find(params[:id])
  end

  def update
    @board = current_user.boards.find(params[:id])

    if @board.update(board_params)
      render :show
    else
      render json: { errors: @board.errors.full_messages }
    end
  end

  def index
    @board = Board.all
  end

  def show
    @board = Board.find(params[:id])

    render :show
  end


  def destroy
    @board = current_user.boards.find(params[:id])
    @board.destroy

    render :show
  end

  private
  def board_params
    params.require(:board).permit(:title, :description)
  end
end
