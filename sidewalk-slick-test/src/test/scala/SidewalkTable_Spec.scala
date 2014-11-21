import org.scalatest._
import scala.slick.driver.H2Driver.simple._
// import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._
//import java.sql.Timestamp
//import org.joda.time.DateTime
import org.joda.time.format.{DateTimeFormatter, DateTimeFormat}

class SidewalkTable_Spec extends FunSuite with BeforeAndAfter {
  val assignments = TableQuery[Assignments]
  val LabelingTasks = TableQuery[LabelingTasks]
  val binnedLabels = TableQuery[binnedLabels]
  val goldenLabels = TableQuery[GoldenLabels]
  val Images = TableQuery[Images]
  val Intersections = TableQuery[Intersections]
  val IpAddresses = TableQuery[IpAddresses]


  implicit var session: Session = _

  // String to Timestamp (joda time)
  // http://stackoverflow.com/questions/6252678/converting-a-date-string-to-a-datetime-object-using-joda-time-library
  // http://stackoverflow.com/questions/5272312/joda-time-library-in-scala-returning-incorrect-date
  val dtf:DateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"); // "2013-06-21 18:03:28"


  // Create table
  // Data Definition Language (DDL): http://slick.typesafe.com/doc/2.0.3/schemas.html#data-definition-language
  def createSchema() = (assignments.ddl ++ LabelingTasks.ddl ++ binnedLabels.ddl ++ goldenLabels.ddl ++ Images.ddl ++ Intersections.ddl ++ IpAddresses.ddl).create
  def insertAssignment(): Int = assignments += Assignment(1,"TestTurkerId","TestHit","TestAssignment","StreetViewLabeler","3", 1,	0,"PilotTask", dtf.parseDateTime("2013-06-21 18:03:28"))
  def insertLabelingTasks(): Int = LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg", 0, "undefined", 0, "NULL")
  def insertBinnedLabels(): Int = binnedLabels += (1,1,3291)
  def insertGoldenLabels(): Int = goldenLabels += GoldenLabel(1,1,3)
  def insertImages(): Int = Images += Image(1,67885, "-dlUzxwCI_-k5RbGw6IlEg", "-dlUzxwCI_-k5RbGw6IlEg_0.jpg", "public/img/QuickVerification/VerificationImages_v2/");
  def insertIntersections(): Int = Intersections += Intersection(1, "38.894799", "-77.021906", "AUz5cV_ofocoDbesxY3Kw", 4, "NULL", "NULL", "DC_Downtown_1_EastWhiteHouse")
  def insertIpAddresses(): Int = IpAddresses += IPAddress(1, "NULL", "NULL", "255.255.255.255")


  before {
    session = Database.forURL("jdbc:h2:mem:sidewalktable", driver = "org.h2.Driver").createSession()
    //session = Database.forURL("jdbc:mysql://localhost:3306/sidewalk-test", driver="com.mysql.jdbc.Driver", user="root", password="").createSession()
  }

  test("Creating the Schema works") {
    createSchema()

    val tables = MTable.getTables.list

    assert(tables.size == 7)
    assert(tables.count(_.name.name.equalsIgnoreCase("assignments")) == 1)
  }


  test("Inserting an Assignment works") {
    session.withTransaction {
      createSchema()

      val insertCount = insertAssignment()
      assert(insertCount == 1)

      session.rollback()
    }

    session.withTransaction {
      // DateTime dt = formatter.parseDateTime(string);

      assignments += Assignment(1, "TestTurkerId", "TestHit", "TestAssignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2, "Test_Kotaro", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3, "Researcher_Jonah", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "ResearcherTask", dtf.parseDateTime("2013-07-03 12:24:36"))

      val results = assignments.list
      assert(results.size == 3)

      val items = assignments.filter(_.AssignmentId === 1).list

      assert(items.head.AmazonTurkerId == "TestTurkerId")
      session.rollback()
    }
  }


  test("Query Assignments works") {
    session.withTransaction {
      createSchema()
      insertAssignment()
      val results = assignments.list
      assert(results.size == 1)
      assert(results.head.AssignmentId == 1)

      session.rollback()
    }
  }

  test("Inserting LabelingTasks works") {
    session.withTransaction {
      createSchema()

      val insertCount = insertLabelingTasks()
      assert(insertCount == 1)

      session.rollback()
    }
    session.withTransaction {
      LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (3,	2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

      val results = LabelingTasks.list
      assert(results.size == 3)
      assert(results.head._1 == 2)
    }
  }

  // Inner join test, joining assignments and LabelingTasks where AssignmentIds for both are equal
  test("Inner join test: assignments and LabelingTasks") {

    session.withTransaction {

      createSchema()

      assignments += Assignment(1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	dtf.parseDateTime("2013-07-03 12:24:36"))

      LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (3, 2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

     //Slick inner join
     //http://slick.typesafe.com/doc/2.1.0/queries.html
     /*val joined = for {
        (a, l) <- assignments innerJoin LabelingTasks on (_.AssignmentId === _.AssignmentId)
      } yield (a.AssignmentId, a.AmazonTurkerId, l.LabelingTaskId)*/

      val innerjoin = for {
        a <- assignments
        l <- LabelingTasks if a.AssignmentId === l.AssignmentId
      } yield(a.AssignmentId, a.AmazonTurkerId, l.LabelingTaskId)

      val results = innerjoin.list

      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == "TestTurkerId")

  }}

  // Test by Akash Magoon 11/15/2014
  test("Query binnedLabels works") {
    session.withTransaction {
      createSchema()
      insertBinnedLabels()
      val results = binnedLabels.list
      assert(results.size == 1)
      assert(results.head._1 == 1)
      session.rollback()
    }
  }
  test("Inserting binnedLabels works") {
    createSchema()
      binnedLabels += (1,1,3291)
      binnedLabels += (2,1,3292)
      binnedLabels += (3,1,3293)

      val results = binnedLabels.list
      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == 1)
      assert(results.head._3 == 3291)

    }
  test("Inner join test: assignments, LabelingTasks, binned labels") {

    session.withTransaction {

      createSchema()

      assignments += Assignment(1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	dtf.parseDateTime("2013-07-03 12:24:36"))

      binnedLabels += (1,1,3291)
      binnedLabels += (2,1,3292)
      binnedLabels += (3,1,3293)

        val innerjoin = for {
        a <- assignments
        b <- binnedLabels
        if a.AssignmentId === b.BinnedLabelId
      } yield(a.AssignmentId, a.AmazonTurkerId, b.LabelId, b.LabelBinId)

      val results = innerjoin.list

      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == "TestTurkerId")

    }}
  // Test by Akash Magoon 11/19/2014
  test("Query goldenLables works") {
    session.withTransaction {
      createSchema()
      insertGoldenLabels()
      val results = goldenLabels.list

      assert(results.size == 1)
//      assert(results.head._1 == 1)
      assert(results.head.GoldenLabelId == 1)
      assert(results.head.GoldenLabelId != 2)
      session.rollback()
    }
  }
  test("Inserting GoldenLabels works") {
    createSchema()
//    goldenLabels += (1,1,3)
//    goldenLabels += (2,2,3)
//    goldenLabels += (3,3,3)
    goldenLabels += GoldenLabel(1, 1, 3)
    goldenLabels += GoldenLabel(2, 2, 3)
    goldenLabels += GoldenLabel(3, 3, 3)

    val results = goldenLabels.list
    assert(results.size == 3)
//    assert(results.head._1 == 1)
//    assert(results.head._2 == 1)
//    assert(results.head._3 == 3)
    assert(results.head.GoldenLabelId == 1)
    assert(results.head.TaskImageId == 1)
    assert(results.head.LabelTypeId == 3)

  }
  // Test by Akash Magoon 11/20/2014
  test("Query images works") {
    session.withTransaction {
      createSchema()
      insertImages()
      val results = Images.list

      assert(results.size == 1)
      assert(results.head.ImageId == 1)
      assert(results.head.ImageId != 2)
      session.rollback()
    }
  }
  test("Inserting images works") {
    createSchema()
    Images += Image(1,67885,"-dlUzxwCI_-k5RbGw6IlEg", "-dlUzxwCI_-k5RbGw6IlEg_0.jpg", "public/img/QuickVerification/VerificationImages_v2/")

    Images += Image(2,67886,"-dlUzxwCI_-k5RbGw6IlEg","-dlUzxwCI_-k5RbGw6IlEg_1.jpg","public/img/QuickVerification/VerificationImages_v2/")
    Images += Image(3,67887, "-dlUzxwCI_-k5RbGw6IlEg","-dlUzxwCI_-k5RbGw6IlEg_2.jpg","public/img/QuickVerification/VerificationImages_v2/")
    val results = Images.list
    assert(results.size == 3)
    assert(results.head.GSVPanoramaId == "-dlUzxwCI_-k5RbGw6IlEg")
    assert(results.head.Url == "-dlUzxwCI_-k5RbGw6IlEg_0.jpg")
    assert(results.head.Path == "public/img/QuickVerification/VerificationImages_v2/")


  }
  // Test by Akash Magoon 11/20/2014
  test("Query Intersections works") {
    session.withTransaction {
      createSchema()
      insertIntersections()
      val results = Intersections.list

      assert(results.size == 1)
      assert(results.head.IntersectionId == 1)
      assert(results.head.IntersectionId != 2)
      session.rollback()
    }
  }
  test("Inserting Intersections works") {
    createSchema()
    Intersections += Intersection(1, "38.894799", "-77.021906", "AUz5cV_ofocoDbesxY3Kw", 4, "NULL", "NULL", "DC_Downtown_1_EastWhiteHouse")
    Intersections += Intersection(2, "38.897327", "-77.023986", "5J5Fm8t9Azuo1nA1_WpsGw", 4, "NULL", "NULL", "DC_Downtown_1_EastWhiteHouse")
    Intersections += Intersection(3, "38.899928", "-77.030276", "N5EGvkfw9AaCsUX4MOdkDA", 4, "NULL", "NULL", "DC_Downtown_1_EastWhiteHouse")

    val results = Intersections.list
    assert(results.size == 3)
    assert(results.head.IntersectionId == 1)
    assert(results.head.Lat == "38.894799")
    assert(results.head.Note == "NULL")


  }
  // Test by Akash Magoon 11/20/2014
  test("Query IpAddresses works") {
    session.withTransaction {
      createSchema()
      insertIpAddresses()
      val results = IpAddresses.list

      assert(results.size == 1)
      assert(results.head.IpAddressId == 1)
      assert(results.head.IpAddressId != 2)
      session.rollback()
    }
  }
  test("Inserting IpAddresses works") {
    createSchema()
    IpAddresses += IPAddress(1, "NULL", "NULL", "255.255.255.255")
    IpAddresses += IPAddress(2, "LabelingTask", "3486","1")
    IpAddresses += IPAddress(3, "LabelingTask", "3584", "1")

    val results = IpAddresses.list
    assert(results.size == 3)
    assert(results.head.IpAddressId == 1)
    assert(results.head.TaskType == "NULL")
    assert(results.head.TaskId == "NULL")


  }
after {
    session.close()
  }
}