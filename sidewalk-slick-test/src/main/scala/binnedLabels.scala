import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class BinnedLabel(BinnedLabelId: Int,LabelBinId: Int, LabelId: Int)

class BinnedLabels(tag: Tag)
  extends Table[BinnedLabel](tag, "BinnedLabels") {

  def BinnedLabelId: Column[Int] = column[Int]("BinnedLabelId", O.PrimaryKey)
  def LabelBinId: Column[Int] = column[Int]("LabelBinId")
  def LabelId: Column[Int] = column[Int]("LabelId")


  def * = (BinnedLabelId, LabelBinId, LabelId) <> (BinnedLabel.tupled, BinnedLabel.unapply _)

}
