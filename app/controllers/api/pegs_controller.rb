class Api::PegsController < ApplicationController

  def index

    @pegs = Peg.all
    @boards = @pegs.map {|peg| peg.board}

    render 'api/pegs/index'
  end


  def show
    @peg = Peg.find(params[:id])
    render 'api/pegs/show'
  end



  def create
    @peg = Peg.new(peg_params)
    @peg.author_id = current_user.id

    if @peg.save
      render 'api/pegs/show'
    else
      render json: @peg.errors.full_messages,status: 422
    end
  end



  def update
    @peg = current_user.pegs.find(params[:id])

    if @peg
      if @peg.update(peg_params)
        render 'api/pegs/show'
      else
        render json: @peg.errors.full_messages, status: 422
      end
    else
      render json: ["You do not have permission to update this peg"],status: 401
    end
  end



  def destroy
    @peg = current_user.pegs.find(params[:id])

    if @peg
      if @peg.destroy
        render 'api/pegs/show'
      else
        render json: ["Failed to delete"],status: 404
      end
    else
      render json: ["You do not have permission to delete this peg."],status: 401
    end
  end



  private

  def peg_params
    params.require(:peg).permit(:title,:description,:author_id,:board_id,:url,:image_url,:image_file_name)
  end


end
