import org.scalatest._
// import scala.slick.driver.H2Driver.simple._
import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._

class TablesSuite extends FunSuite with BeforeAndAfter {

  val suppliers = TableQuery[Suppliers]
  val coffees = TableQuery[Coffees]
  
  implicit var session: Session = _

  def createSchema() = {
    if (MTable.getTables("suppliers").list.isEmpty) {
      suppliers.ddl.create
    }
    if (MTable.getTables("coffees").list.isEmpty) {
      coffees.ddl.create
    }
  }
  def insertSupplier(): Int = suppliers += (101, "Acme, Inc.", "99 Market Street", "Groundsville", "CA", "95199")
  
  before {
    // session = Database.forURL("jdbc:h2:mem:tablesuite", driver = "org.h2.Driver").createSession()
    session = Database.forURL("jdbc:mysql://localhost:3306/sidewalk-test", user="root", password="", driver = "com.mysql.jdbc.Driver").createSession()
  }
  
  test("Creating the Schema works") {
    session.withTransaction {
      createSchema()

      val tables = MTable.getTables.list

      assert(tables.size == 2)
      assert(tables.count(_.name.name.equalsIgnoreCase("suppliers")) == 1)
      assert(tables.count(_.name.name.equalsIgnoreCase("coffees")) == 1)
      session.rollback()
    }
  }

  test("Inserting a Supplier works") {
    session.withTransaction {
      createSchema()

      val insertCount = insertSupplier()
      assert(insertCount == 1)
      session.rollback()
    }
  }
  
  test("Query Suppliers works") {
    session.withTransaction {
      createSchema()
      insertSupplier()
      val results = suppliers.list
      assert(results.size == 1)
      assert(results.head._1 == 101)

      session.rollback()
    }
  }
  
  after {
    session.close()
  }

}