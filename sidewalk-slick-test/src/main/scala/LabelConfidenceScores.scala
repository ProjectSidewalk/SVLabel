/**
 * Created by Akash on 11/21/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelConfidenceScore(LabelConfidenceScoreId: Int,LabelId: Int , ConfidenceScore: Double)

class LabelConfidenceScores(tag: Tag)
  extends Table[LabelConfidenceScore](tag, "LabelConfidenceScore") {

  def LabelConfidenceScoreId: Column[Int] = column[Int]("LabelConfidenceScoreId", O.PrimaryKey)
  def LabelId: Column[Int] = column[Int]("LabelId")
  def ConfidenceScore: Column[Double] = column[Double]("ConfidenceScore")



  def * = (LabelConfidenceScoreId,LabelId,ConfidenceScore ) <> (LabelConfidenceScore.tupled, LabelConfidenceScore.unapply _)
}
