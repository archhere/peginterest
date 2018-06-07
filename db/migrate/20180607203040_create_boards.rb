class CreateBoards < ActiveRecord::Migration[5.1]
  def change
    create_table :boards do |t|
      t.string :title,null: false
      t.text :description
      t.integer :author_id,null: false
      t.timestamps
    end
    add_index :boards, [:title,:author_id],unique: true
    add_index :boards, :title
    add_index :boards, :author_id
  end
end
