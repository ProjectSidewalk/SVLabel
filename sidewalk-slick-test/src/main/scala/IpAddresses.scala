import scala.slick.driver.H2Driver.simple._

case class IPAddress(IpAddressId: Int, TaskType: String, TaskId: String, IpAddress: String)

class IpAddresses(tag: Tag)
  extends Table[IPAddress](tag, "IpAddresses") {

  def IpAddressId: Column[Int] = column[Int]("IpAddressId", O.PrimaryKey)
  def TaskType: Column[String] = column[String]("TaskType")
  def TaskId: Column[String] = column[String]("TaskId")
  def IpAddress: Column[String] = column[String]("IpAddress")

  def * = (IpAddressId, TaskType, TaskId, IpAddress) <> (IPAddress.tupled, IPAddress.unapply _)
}
