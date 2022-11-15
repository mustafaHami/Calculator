<?php
    $str = $_POST['data'];
    $fich = fopen('etat.json', 'w');
    // Ecriture de la chaine récupérée dans le fichier etat.json
    fputs($fich, $str);
    fclose($fich);
  ?>