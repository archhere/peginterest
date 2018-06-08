class Api::BoardsController < ApplicationController



  def index
    @boards = current_user.boards
    render 'api/boards/index'
  end


  def show
    @board = Board.find(params[:id])
    render 'api/boards/show'
  end


  def create
    @board = Board.new(board_params)
    @board.author_id = current_user.id

    if @board.save
      render 'api/boards/show'
    else
      render json: @board.errors.full_messages, status: 422
    end
  end



  def update
    @board = current_user.boards.find(params[:id])

    if @board
      if @board.update(board_params)
        render 'api/boards/show'
      else
        render json: @board.errors.full_messages, status: 422
      end
    else
      render json: ["You do not have permission to edit this board."], status: 401
    end
  end


  def destroy
    @board = current_user.boards.find(params[:id])
    if @board
      if @board.destroy
        render 'api/boards/show'
      else
        render json: ["Failed to delete."], status: 404
      end
    else
      render json: ["You do not have permission to delete this board."], status: 401
    end
  end

  private
  def board_params
    params.require(:board).permit(:title, :description)
  end
end
