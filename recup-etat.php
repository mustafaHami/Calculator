<?php
    // Ouverture du fichier en lecture seule
    $fich = fopen('etat.json', 'r');

    // Lecture du fichier ligne par ligne
    $data = "";
    while (($buffer = fgets($fich)) !== false) {
      $data .= $buffer;
    }

    // Envoie des données via un echo
    echo($data);
    fclose($fich);
  ?>