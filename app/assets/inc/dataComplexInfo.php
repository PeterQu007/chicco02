<?php
if (isset($_POST["complexInfos"]))
{
    $complexInfos = $_POST["complexInfos"];
    // echo $title;
    // echo " is your tab title";
    // print_r($complexName);
}
else
{
    $complexInfos = array((object)[
        "DwellingType" => "Apartment/Condo",
        "PropertyType" => "Residential Attached",
        "Province" => "BC",
        "YearBuilt"=> "1982",
        "address"=> "4373 HALIFAX ST",
        "bylawRentalRestriction"=> " ",
        "city"=> "Burnaby",
        "cityDistrict"=> "Burnaby North",
        "complexName"=> "Brent Garden", //
        "neighborhood"=> "Brentwood Park",
        "postcode"=> "V5C 5Z2",
        "storeys"=> "24",
        "strataPlan"=> "NWS2036",
        "strataPlanID"=> "NWS2036-4373-HALIFAX-ST",
        "titleToLand"=> "Freehold Strata",
        "units"=> "334"  ],
        (object)[
            "DwellingType"=> "Apartment/Condo",
            "PropertyType"=> "Residential Attached",
            "Province"=> "BC",
            "YearBuilt"=> "1983",
            "address"=> "2041 BELLWOOD AV",
            "bylawRentalRestriction"=> " ",
            "city"=> "Burnaby",
            "cityDistrict"=> "Burnaby North",
            "complexName"=> "Anola Place", //
            "neighborhood"=> "Brentwood Park",
            "postcode"=> "V5B 4V5",
            "storeys"=> " 1",
            "strataPlan"=> "NWS2020",
            "strataPlanID"=> "NWS2020-2041-BELLWOOD-AV",
            "titleToLand"=> "Freehold Strata",
            "units"=> " 50"]);
}



// if (isset($_POST["postID"]))
// {
//   $ID = $_POST["postID"];
//   // echo $ID;
//   // echo " is your tab id";
//   print_r($ID);
// }
// else
// {
//   $ID = null;
//   echo "<p>no tab ID supplied</p>";
// }
/* <div > <?php echo $title . $ID ?> </div> */
?>
<?php

// include_once('pdoConn.php');
//  $sql = "INSERT INTO pid_complex (
//                              Dwelling_Type,
//                              Property_Type,
//                              Province,
//                              Year_Built,
//                              address,
//                              bylaw_Rental_Restriction,
//                              city,
//                              city_District,
//                              Complex_Name,
//                              neighborhood,
//                              postcode,
//                              storeys,
//                              strata_Plan_num,
//                              strata_Plan_ID,
//                              title_To_Land,
//                              units          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//  $stmt_insert_complex = $pdo->prepare($sql);
//  try{
//    $pdo->beginTransaction();
//    foreach($complexInfos as $complexInfo){
//      $stmt_insert_complex->execute(array(
//                              $complexInfo->DwellingType,
//                              $complexInfo->PropertyType,
//                              $complexInfo->Province,
//                              $complexInfo->YearBuilt,
//                              $complexInfo->address,
//                              $complexInfo->bylawRentalRestriction,
//                              $complexInfo->city,
//                              $complexInfo->cityDistrict,
//                              $complexInfo->complexName,
//                              $complexInfo->neighborhood,
//                              $complexInfo->postcode,
//                              (int)$complexInfo->storeys,
//                              $complexInfo->strataPlan,
//                              $complexInfo->strataPlanID,
//                              $complexInfo->titleToLand,
//                              (int)$complexInfo->units
//      ));
//    }
//    $pdo->commit();
//  }catch(Exception $e){
//    $pdo->rollback();
//    throw $e;
//  }

//  $stmt_insert_complex = null;
//  $pdo = null;

//  //read from database::
//  $mysqli = new mysqli("localhost", "root", "root", "local");

//  $strSql = "SELECT Complex_Name, Year_Built, City, Address FROM pid_complex WHERE complex_name='" . $complexInfos[0]->complexName . "'";
//  $mysqli->real_query($strSql);
//  $res = $mysqli->use_result();
//  $return_arr = [];

//  while ($row = $res->fetch_assoc()){
//    // var_dump($row);
//    $return_arr[] = $row;
//  }

//$return_arr = json_encode($return_arr);
foreach($complexInfos as $complexInfo){
    $ret = array(
        $complexInfo->DwellingType,
        $complexInfo->PropertyType,
        $complexInfo->Province,
        $complexInfo->YearBuilt,
        $complexInfo->address,
        $complexInfo->bylawRentalRestriction,
        $complexInfo->city,
        $complexInfo->cityDistrict,
        $complexInfo->complexName,
        $complexInfo->neighborhood,
        $complexInfo->postcode,
        (int)$complexInfo->storeys,
        $complexInfo->strataPlan,
        $complexInfo->strataPlanID,
        $complexInfo->titleToLand,
        (int)$complexInfo->units    );
    $ret_array[] = $ret;
}
$return_arr = json_encode($ret_array);
echo $return_arr;

?>
