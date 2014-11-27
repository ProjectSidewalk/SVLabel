/**
 * Created by Akash on 11/25/2014.
 */

import java.sql.Timestamp

import org.joda.time.DateTime

import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskEnvironment(LabelingTaskEnvironmentId: Int,LabelingTaskId: Int,Browser: String, BrowserVersion:String,
                                   BrowserWidth: String, BrowserHeight: String,AvailWidth: String, AvailHeight: String, ScreenWidth: String,
                                   ScreenHeight: String, OperatingSystem: String,DatetimeInserted: DateTime )

class LabelingTaskEnvironments(tag: Tag)
  extends Table[LabelingTaskEnvironment](tag, "LabelingTaskEnvironment") {

  def LabelingTaskEnvironmentId: Column[Int] = column[Int]("LabelingTaskEnvironmentId", O.PrimaryKey)
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId")
  def Browser: Column[String] = column[String]("Browser")
  def BrowserVersion: Column[String] = column[String]("BrowserVersion")
  def BrowserWidth: Column[String] = column[String]("BrowserWidth")
  def BrowserHeight: Column[String] = column[String]("BrowserHeight")
  def AvailWidth: Column[String] = column[String]("AvailWidth")
  def AvailHeight: Column[String] = column[String]("AvailHeight")
  def ScreenWidth: Column[String] = column[String]("ScreenWidth")
  def ScreenHeight: Column[String] = column[String]("ScreenHeight")
  def OperatingSystem: Column[String] = column[String]("OperatingSystem")
  // Converting joda datetime
  // http://stackoverflow.com/questions/22942202/slick-library-w-play-date-type-incompatibility
  // https://groups.google.com/forum/#!msg/scalaquery/4Ns_J_8wbqQ/0SGiJL4O8A8J
  // http://www.epochconverter.com/
  implicit val dateTimeColumnType = MappedColumnType.base[DateTime, Timestamp](
  { dt => new java.sql.Timestamp(dt.getMillis) },
  { ts => new DateTime(ts) }
  )
  def DatetimeInserted: Column[DateTime] = column[DateTime]("DatetimeInserted")








  def * = (LabelingTaskEnvironmentId,LabelingTaskId,Browser, BrowserVersion,BrowserWidth, BrowserHeight,AvailWidth, AvailHeight, ScreenWidth, ScreenHeight, OperatingSystem,DatetimeInserted) <> (LabelingTaskEnvironment.tupled, LabelingTaskEnvironment.unapply _)
}
