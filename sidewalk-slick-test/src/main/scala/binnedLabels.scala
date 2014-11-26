import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

class BinnedLabels(tag: Tag)
  extends Table[(Int,Int,Int)](tag, "binnedLabels") {

  def BinnedLabelId: Column[Int] = column[Int]("BinnedLabelId", O.PrimaryKey)
  def LabelBinId: Column[Int] = column[Int]("LabelBinId")
  def LabelId: Column[Int] = column[Int]("LabelId")


  def * : ProvenShape[(Int,Int,Int)] =
    (BinnedLabelId,LabelBinId,LabelId)
}
