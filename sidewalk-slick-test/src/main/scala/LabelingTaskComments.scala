/**
 * Created by Akash on 11/21/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskComment(LabelingTaskCommentId: Int,LabelingTaskId: Int,Comment: String  )

class LabelingTaskComments(tag: Tag)
  extends Table[LabelingTaskComment](tag, "LabelingTaskComment") {

  def LabelingTaskCommentId: Column[Int] = column[Int]("LabelingTaskCommentId", O.PrimaryKey)
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId")
  def Comment: Column[String] = column[String]("Comment")






  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (LabelingTaskCommentId, LabelingTaskId, Comment) <> (LabelingTaskComment.tupled, LabelingTaskComment.unapply _)
}

