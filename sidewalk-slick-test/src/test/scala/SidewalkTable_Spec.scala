import org.scalatest._
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.TableQuery

// import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._
//import java.sql.Timestamp
//import org.joda.time.DateTime
import org.joda.time.format.{DateTimeFormatter, DateTimeFormat}

class SidewalkTable_Spec extends FunSuite with BeforeAndAfter {
  val assignments = TableQuery[Assignments]
  val LabelingTasks = TableQuery[LabelingTasks]
  val binnedLabels = TableQuery[BinnedLabels]
  val goldenLabels = TableQuery[GoldenLabels]
  val Images = TableQuery[Images]
  val Intersections = TableQuery[Intersections]
  val IpAddresses = TableQuery[IpAddresses]
  val LabelBins = TableQuery[LabelBins]
  val LabelConfidenceScores = TableQuery[LabelConfidenceScores]
  val LabelCorrectnessClass = TableQuery[LabelCorrectnessClass]
  val LabelingTaskAttributes = TableQuery[LabelingTaskAttributes]
  val LabelingTaskComments = TableQuery[LabelingTaskComments]
  val LabelingTaskCounts = TableQuery[LabelingTaskCounts]
  val LabelingTaskEnvironments = TableQuery[LabelingTaskEnvironments]
  val LabelingTaskInteractions = TableQuery[LabelingTaskInteractions]
  val LabelPhotographerPovs = TableQuery[LabelPhotographerPovs]
  val LabelPoints = TableQuery[LabelPoints]

  implicit var session: Session = _

  // String to Timestamp (joda time)
  // http://stackoverflow.com/questions/6252678/converting-a-date-string-to-a-datetime-object-using-joda-time-library
  // http://stackoverflow.com/questions/5272312/joda-time-library-in-scala-returning-incorrect-date
  val dtf:DateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"); // "2013-06-21 18:03:28"


  def insertAssignment(): Int = assignments += Assignment(1,"TestTurkerId","TestHit","TestAssignment","StreetViewLabeler","3", 1,	0,"PilotTask", dtf.parseDateTime("2013-06-21 18:03:28"))
  // Create table
  // Data Definition Language (DDL): http://slick.typesafe.com/doc/2.0.3/schemas.html#data-definition-language
  def createSchema() = (assignments.ddl ++ LabelingTasks.ddl ++ binnedLabels.ddl ++ goldenLabels.ddl ++ Images.ddl ++ Intersections.ddl ++ IpAddresses.ddl ++ LabelBins.ddl ++ LabelConfidenceScores.ddl ++ LabelCorrectnessClass.ddl ++ LabelingTaskAttributes.ddl ++ LabelingTaskComments.ddl ++ LabelingTaskCounts.ddl ++ LabelingTaskEnvironments.ddl ++ LabelingTaskInteractions.ddl ++ LabelPhotographerPovs.ddl ++ LabelPoints.ddl).create
  def insertLabelingTasks(): Int = LabelingTasks += LabelingTask(2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg", 0, "undefined", 0, dtf.parseDateTime("2013-06-30 22:08:14"))
  def insertBinnedLabels(): Int = binnedLabels += (1,1,3291)
  def insertGoldenLabels(): Int = goldenLabels += GoldenLabel(1,1,3)
  def insertImages(): Int = Images += Image(1,67885, "-dlUzxwCI_-k5RbGw6IlEg", "-dlUzxwCI_-k5RbGw6IlEg_0.jpg", "public/img/QuickVerification/VerificationImages_v2/")
  def insertIntersections(): Int = Intersections += Intersection(1, "38.894799", "-77.021906", "AUz5cV_ofocoDbesxY3Kw", 4, "NULL", "NULL", "DC_Downtown_1_EastWhiteHouse")
  def insertIpAddresses(): Int = IpAddresses += IPAddress(1, "NULL", "NULL", "255.255.255.255")
  def insertLabelBins(): Int = LabelBins += LabelBin(1, "NULL", "NULL", "FirstDetectionResult", 0)
  def insertLabelConfidenceScores(): Int = LabelConfidenceScores += LabelConfidenceScore(1,2851,-0.998391)
  def insertLabelCorrectnessClass(): Int = LabelCorrectnessClass += LabelCorrectness1(1,17345,1)
  def insertLabelingTaskAttributes(): Int = LabelingTaskAttributes += LabelingTaskAttribute(1, 18565, "FalseNegative")
  def insertLabelingTaskComments(): Int = LabelingTaskComments += LabelingTaskComment(1, 169, "Kotaro: This is not a typical intersection. I am not really sure where they should have curb ramps.")
  def insertLabelingTaskCounts(): Int = LabelingTaskCounts += LabelingTaskCount(3,2,0)
  def insertLabelingTaskEnvironments(): Int = LabelingTaskEnvironments += LabelingTaskEnvironment(4,4,"chrome", "27.0.1453.116", "1452", "905", "1920", "1080", "1920", "1080", "MacOS", "2013-06-30 22:08:14")
  def insertLabelingTaskInteractions(): Int = LabelingTaskInteractions += LabelingTaskInteraction(1,1,"Click_ModeSwitch_CurbRamp","3dlyB8Z0jFmZKSsTQJjMQg", "38.935869", "-77.0192099", 0, -10, 1, "undefined", "1371852933632" )
  def insertLabelPhotographerPovs(): Int = LabelPhotographerPovs += LabelPhotographerPov(1,18097,357.76f, -2.08f)
  def insertLabelPoints(): Int = LabelPoints += LabelPoint(1, 2, 12562, 542, 197, 44, 0, -10, 1, 197, 44, 0, -10, 1, 6656, 13312, 480, 720, 4.6d, -4.65d, 38.935869d, -77.01921d)
  before {
    session = Database.forURL("jdbc:h2:mem:sidewalktable", driver = "org.h2.Driver").createSession()
    //session = Database.forURL("jdbc:mysql://localhost:3306/sidewalk-test", driver="com.mysql.jdbc.Driver", user="root", password="").createSession()
  }

  test("Creating the Schema works") {
    createSchema()

    val tables = MTable.getTables.list

    assert(tables.size == 17)
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
      LabelingTasks += LabelingTask(2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, dtf.parseDateTime("2013-06-21 18:03:28"))
      LabelingTasks += LabelingTask(3,	2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, dtf.parseDateTime("2013-06-21 18:03:28"))
      LabelingTasks += LabelingTask(4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, dtf.parseDateTime("2013-06-21 18:03:28"))

      val results = LabelingTasks.list
      assert(results.size == 3)
      assert(results.head.LabelingTaskId == 2)
    }
  }

  // Inner join test, joining assignments and LabelingTasks where AssignmentIds for both are equal
  test("Inner join test: assignments and LabelingTasks") {

    session.withTransaction {

      createSchema()

      assignments += Assignment(1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	dtf.parseDateTime("2013-07-03 12:24:36"))

      LabelingTasks += LabelingTask(2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, dtf.parseDateTime("2013-06-21 18:03:28"))
      LabelingTasks += LabelingTask(3, 2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, dtf.parseDateTime("2013-06-21 18:03:28"))
      LabelingTasks += LabelingTask(4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, dtf.parseDateTime("2013-06-21 18:03:28"))

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
  // Test by Akash Magoon 11/20/2014
  test("Query LabelBins works") {
    session.withTransaction {
      createSchema()
      insertLabelBins()
      val results = LabelBins.list

      assert(results.size == 1)
      assert(results.head.LabelBinId== 1)
      assert(results.head.LabelBinId != 2)
      session.rollback()
    }
  }
  test("Inserting LabelBins works") {
    createSchema()
    LabelBins += LabelBin(1, "NULL", "NULL", "FirstDetectionResult",0)
    LabelBins += LabelBin(2, "NULL", "NULL", "FirstDetectionResult", 0)
    LabelBins += LabelBin(3, "NULL", "NULL", "FirstDetectionResult", 0)

    val results = LabelBins.list
    assert(results.size == 3)
    assert(results.head.TaskPanoramaId == "NULL")
    assert(results.head.NoLabel == 0)



  }
  // Test by Akash Magoon 11/21/2014
  test("Query LabelConfidenceScores works") {
    session.withTransaction {
      createSchema()
      insertLabelConfidenceScores()
      val results = LabelConfidenceScores.list

      assert(results.size == 1)
      assert(results.head.LabelConfidenceScoreId== 1)
      assert(results.head.LabelConfidenceScoreId != 2)
      session.rollback()
    }
  }
  test("Inserting LabelConfidenceScores works") {
    createSchema()
    LabelConfidenceScores += LabelConfidenceScore(1,2851,-0.998391)
    LabelConfidenceScores += LabelConfidenceScore(2, 2852, -0.998322)
    LabelConfidenceScores += LabelConfidenceScore(3,2853, -0.997478 )

    val results = LabelConfidenceScores.list
    assert(results.size == 3)
    assert(results.head.LabelId == 2851)



  }
  // Test by Akash Magoon 11/21/2014
  test("Query LabelCorrectnessIDs works") {
    session.withTransaction {
      createSchema()
      insertLabelCorrectnessClass()
      val results = LabelCorrectnessClass.list

      assert(results.size == 1)
      assert(results.head.LabelCorrectnessId == 1)
      assert(results.head.LabelCorrectnessId != 2)
    }
  }
  test("Inserting LabelCorrectnessIDs works") {
    createSchema()

    LabelCorrectnessClass += LabelCorrectness1(1,17345, 1)
    LabelCorrectnessClass += LabelCorrectness1(2,17346, 1)
    LabelCorrectnessClass += LabelCorrectness1(3,17347, 1)

    val results = LabelCorrectnessClass.list
    assert(results.size == 3)
    assert(results.head.LabelId == 17345)



  }
  // Test by Akash Magoon 11/21/2014
  test("Query LabelingTaskAttributes works") {
    session.withTransaction {
      createSchema()
      insertLabelingTaskAttributes()
      val results = LabelingTaskAttributes.list

      assert(results.size == 1)
      assert(results.head.LabelingTaskAttributeId== 1)
      assert(results.head.LabelingTaskAttributeId != 2)
      session.rollback()
    }
  }
  test("Inserting LabelingTaskAttributes works") {
    createSchema()
    LabelingTaskAttributes += LabelingTaskAttribute(1, 18565, "FalseNegative")
    LabelingTaskAttributes += LabelingTaskAttribute(2, 18566, "FalseNegative")
    LabelingTaskAttributes += LabelingTaskAttribute(3, 18567, "FalseNegative")

    val results = LabelingTaskAttributes.list
    assert(results.size == 3)
    assert(results.head.LabelingTaskAttributeId == 1)
    assert(results.head.LabelingTaskId == 18565)



  }
  // Test by Akash Magoon 11/21/2014
  test("Query LabelingTaskComments works") {
    session.withTransaction {
      createSchema()
      insertLabelingTaskComments()
      val results = LabelingTaskComments.list

      assert(results.size == 1)
      assert(results.head.LabelingTaskCommentId == 1)
      assert(results.head.LabelingTaskCommentId != 2)
      session.rollback()
    }
  }
  test("Inserting LabelingTaskComments works") {
    createSchema()
    LabelingTaskComments += LabelingTaskComment(1,169, "Kotaro: This is not a typical intersection. I am not really sure where they should have curb ramps.")
    LabelingTaskComments += LabelingTaskComment(2, 180, "Kotaro: This scene is too complex because of two reasons: more than two streets intersecting, and there is an island in the middle of the street and it has a pedestrians\' path but not curb ramps.")
    LabelingTaskComments += LabelingTaskComment(3, 182, "Kotaro: Too bright to see")

    val results = LabelingTaskComments.list
    assert(results.size == 3)
    assert(results.head.LabelingTaskCommentId == 1)
    assert(results.head.LabelingTaskId == 169)
  }
  // Test by Akash Magoon 11/21/2014
  test("Query LabelingTaskCounts works") {
    session.withTransaction {
      createSchema()
      insertLabelingTaskCounts()
      val results = LabelingTaskCounts.list

      assert(results.size == 1)
      assert(results.head.LabelingTaskCountId == 3)
      assert(results.head.LabelingTaskCountId != 2)
      session.rollback()
    }
  }
  test("Inserting LabelingTaskCounts works") {
    createSchema()
    LabelingTaskCounts += LabelingTaskCount(3,2,0)
    LabelingTaskCounts += LabelingTaskCount(4,220,0)
    LabelingTaskCounts += LabelingTaskCount(5,221,0)

    val results = LabelingTaskCounts.list
    assert(results.size == 3)
    assert(results.head.LabelingTaskCountId == 3)
    assert(results.head.TaskPanoramaId == 2)



  }
  // Test by Akash Magoon 11/25/2014
  test("Query LabelingTaskEnvironments works") {
    session.withTransaction {
      createSchema()
      insertLabelingTaskEnvironments()
      val results = LabelingTaskEnvironments.list

      assert(results.size == 1)
      assert(results.head.LabelingTaskEnvironmentId == 4)
      assert(results.head.LabelingTaskEnvironmentId != 6)
      session.rollback()
    }
  }
  test("Inserting LabelingTaskEnvironments works") {
    createSchema()
    LabelingTaskEnvironments += LabelingTaskEnvironment(4,4,"chrome", "27.0.1453.116", "1452", "905", "1920", "1080", "1920", "1080", "MacOS", "2013-06-30 22:08:14")
    LabelingTaskEnvironments += LabelingTaskEnvironment(5,5,"chrome", "27.0.1453.116", "1452", "905", "1920", "1080", "1920", "1080", "MacOS", "2013-06-30 22:19:32")
    LabelingTaskEnvironments += LabelingTaskEnvironment(6, 6, "chrome", "27.0.1453.116", "1452", "905", "1920", "1080", "1920", "1080", "MacOS", "2013-06-30 22:33:29")


    val results = LabelingTaskEnvironments.list
    assert(results.size == 3)
    assert(results.head.LabelingTaskEnvironmentId == 4)
    assert(results.head.LabelingTaskId == 4)



  }

  // Test by Akash Magoon 11/25/2014
  test("Query LabelingTaskInteractions works") {
    session.withTransaction {
      createSchema()
      insertLabelingTaskInteractions()
      val results = LabelingTaskInteractions.list

      assert(results.size == 1)
      assert(results.head.LabelingTaskInteractionId == 1)
      assert(results.head.LabelingTaskInteractionId != 6)
      session.rollback()
    }
  }
  test("Inserting LabelingTaskInteractions works") {
    createSchema()
    LabelingTaskInteractions += LabelingTaskInteraction(1,1,"Click_ModeSwitch_CurbRamp","3dlyB8Z0jFmZKSsTQJjMQg", "38.935869", "-77.0192099", 0, -10, 1, "undefined", "1371852933632" )
    LabelingTaskInteractions += LabelingTaskInteraction(2,1,"LabelingCanvas_MouseDown", "3dlyB8Z0jFmZKSsTQJjMQg", "38.935869", "-77.0192099", 0, -10, 1, "x:212,y:100", "1371852933945" )
    LabelingTaskInteractions += LabelingTaskInteraction(3,1,"LabelingCanvas_MouseUp","3dlyB8Z0jFmZKSsTQJjMQg", "38.935869", "-77.0192099", 0, -10, 1, "x:212,y:100", "1371852934010" )


    val results = LabelingTaskInteractions.list
    assert(results.size == 3)
    assert(results.head.Action == "Click_ModeSwitch_CurbRamp")
    assert(results.head.LabelingTaskId == 1)



  }


  // Test by Akash Magoon 11/25/2014
  test("Query LabelPhotographerPovs works") {
    session.withTransaction {
      createSchema()
      insertLabelPhotographerPovs()
      val results = LabelPhotographerPovs.list

      assert(results.size == 1)
      assert(results.head.LabelPhotographerPovId == 1)
      assert(results.head.LabelPhotographerPovId != 6)
      session.rollback()
    }
  }
  test("Inserting LabelPhotographerPovs works") {
    createSchema()
    LabelPhotographerPovs += LabelPhotographerPov(1,18097,357.76f, -2.08f)
    LabelPhotographerPovs += LabelPhotographerPov(2,18098,357.76f,-2.08f)
    LabelPhotographerPovs += LabelPhotographerPov(3,18099,357.76f,-2.08f)


    val results = LabelPhotographerPovs.list
    assert(results.size == 3)
    assert(results.head.LabelId == 18097)
    assert(results.head.LabelId != 1)



  }
  // Test by Akash Magoon 11/25/2014
  test("Query LabelPoints works") {
    session.withTransaction {
      createSchema()
      insertLabelPoints()
      val results = LabelPoints.list

      assert(results.size == 1)
      assert(results.head.LabelPointId == 1)
      assert(results.head.LabelPointId != 6)
      session.rollback()
    }
  }
  test("Inserting LabelPoints works") {
    createSchema()
    LabelPoints += LabelPoint(1, 2, 12562, 542, 197, 44, 0, -10, 1, 197, 44, 0, -10, 1, 6656, 13312, 480, 720, 4.6, -4.65, 38.935869, -77.01921)
    LabelPoints+= LabelPoint(2, 2, 12631, 225, 212, 112, 0, -10, 1, 212, 112, 0, -10, 1, 6656, 13312, 480, 720, 4.6, -4.65, 38.935869, -77.01921)
    LabelPoints+= LabelPoint(3, 2, 12939, 207, 279, 116, 0, -10, 1, 279, 116, 0, -10, 1, 6656, 13312, 480, 720, 4.6, -4.65, 38.935869, -77.01921)


    val results = LabelPoints.list
    assert(results.size == 3)
    assert(results.head.LabelPointId == 1)
    assert(results.head.LabelPointId != 123)



  }


  after {
    session.close()
  }
}