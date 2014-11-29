import scala.slick.driver.H2Driver.simple._

case class LabelCorrectness1(LabelCorrectnessId: Int,LabelId: Int , LabelCorrectness: Int)

class LabelCorrectnessClass(tag: Tag)
  extends Table[LabelCorrectness1](tag, "LabelCorrectness1") {

  def LabelCorrectnessId: Column[Int] = column[Int]("LabelCorrectnessId", O.PrimaryKey)
  def LabelId: Column[Int] = column[Int]("LabelId")
  def LabelCorrectness: Column[Int] = column[Int]("LabelCorrectness")

  def * = (LabelCorrectnessId,LabelId,LabelCorrectness ) <> (LabelCorrectness1.tupled, LabelCorrectness1.unapply _)
}
