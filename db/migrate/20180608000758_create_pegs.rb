class CreatePegs < ActiveRecord::Migration[5.1]
  def change
    create_table :pegs do |t|
      t.string :title,null: false
      t.integer :author_id,null: false
      t.integer :board_id,null: false
      t.timestamps
    end
    add_index :pegs, :title
    add_index :pegs, :author_id
    add_index :pegs, :board_id
  end
end
