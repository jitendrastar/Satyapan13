import { Component, NgZone } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  NavController,
} from "@ionic/angular";
// import {FileTransferObject} from '@ionic-native/file-transfer';
// import {FileOpener} from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import { Storage } from "@ionic/storage";
import { CommonService } from "../services/common.service";
import { ActivatedRoute } from "@angular/router";
import {
  Downloader,
  DownloadRequest,
  NotificationVisibility,
} from "@ionic-native/downloader/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-post-verification-show-details-confirmation",
  templateUrl: "./post-verification-show-details-confirmation.page.html",
  styleUrls: ["./post-verification-show-details-confirmation.page.scss"],
})
export class PostVerificationShowDetailsConfirmationPage {
  firstView: any = false;
  secondView: any = false;
  thirdView: any = false;
  fourthView: any = false;

  userTab: any = "Action";
  imgData: any = "";
  url: any = "http://www.africau.edu/images/default/sample.pdf";

  uploadBill: any = "base64Image";
  nazariaNaksha: any = "base64Image";
  jabaBand: any = "base64Image";
  imgFarmer: any = "base64Image";
  imgJamabandi: any;
  imgNazariaNaksha: any = "";
  tempVar = false;
  
outerDataOfPipeline=[];
  // imgSignedMap: any='/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzN0IzQzdEOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQzN0IzQzdFOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM3QjNDN0I5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDM3QjNDN0M5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAAerAAAMkwAAEGcAABX//9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wgARCACBAGwDAREAAhEBAxEB/8QA0AAAAgEFAQEAAAAAAAAAAAAAAAUJAQQGBwgCAwEBAQEBAQAAAAAAAAAAAAAAAAECBAUQAAAFBAEEAgMBAAAAAAAAAAIDBAUGABABByARITEVMEFwQhMUEQABAwICBgUJBQYHAAAAAAACAQMEEQUAEiAhMVFhE0FxgSIUEDAyQlJigiMV8JGxJAZAwXJjgyWiQ1Nzk0R0EgEAAAAAAAAAAAAAAAAAAABwEwEAAQMDAwQDAQEBAQAAAAABEQAhMUFRYfBxgRAgscGRodHhcPEw/9oADAMBAAIRAxEAAAGaAqNR0XAAAFCyEpYFALofDATnKBpIbHXRuQ8ioSnwAcjoTkQpgQAfUkkOqy1EBYnsfDU4vI/AAAGJM+ZCJROfYfjAjEOZgAAAlJOihSJT2ZGXZHQchAAAUJdjbwsEoGRl2caEewAAH3JwS7FYmPBkIwORyOMAAC6Jwj7ioRnkfjQVkOphQAB1qSPnzEgoKDcdn1OLSP0APJNEZoWggLEC5HoxOWyM8qA0Jsy6FYhPAFRma+MDNEnIJvkkfObTsARlkBrc5jOeDDjbxLiRZEqxy0RmG5jfR0EZ2QwlQACSAjeJZiOc1kAAZQYuAAB2icskl5FGegAAAAADPTEDeRz+AAAFlze3WWoFAPNnln6TdQA8oaf/2gAIAQEAAQUCsWCgh5iDRgOnAsPWiw2XOCFsTu+4WwjJ23JWYJDuF/JHGpyxye2e9GBoeOlyw1inNxTNDfIZG4yVwuAYyh68nuX4NDx1owNg+QY7VuR1EUh4pFZ6BUzuRbw1Zo3HbpQMdwYttpTk6W8tVmiNhtGV9l+S7bhbckPXKBtmWmKUZX7l+QW3MoEFr4lGAKNTmBOT0Ov3BnuC24UZhzBxIJEoOKL/AIlUZX2HyXmy5EmckciZTY+88NXRL2iyheDc3KFQc9q3EzFGIb58R1tJaWOh5o0VwZ7gFbbSZeqjd0SQ9crTmFmkZowVC4Fip7nEfYCtdS02ThnGtVLcZUV1+8yemGMscUSRvZZK2TmZoYrusujzNTttZYbS+QvjpaCO/pZRkeA07yNiUzYoZRhW2JH6tkprn8pagt+2UplNsmYXfmtc3GRa2rXGV2IfMHwUhkPD3bz/AJuOpnWpCWQU9rHMtpgWO2Pii7r6V+VG5PUu8owsg3y/fDNv/9oACAECAAEFAvzd/9oACAEDAAEFAvzb9//aAAgBAgIGPwJu/9oACAEDAgY/Am7/2gAIAQEBBj8C/Yil3GWxCjDtekOI2NfZGusz4JVcG3ZYD1xJKokmUqw4td4N0OQ4nWgYVWwtUcfYGGblPideJVwn1CDbpzXTyhdhPU6aGJvN1+HHJiuFEuFKlbpiiD602rHNF5coU93Xw8zLuUwsseGyTzm8qei2G83TVBTiuHJ09wstSSJEQvkQmK91lodlaekW0l0AdaMm3WyQ23GyUHGzHWJgQ0ISTCWe7GKXhltSYkak+psh6aqmxJjQ6yRPTHXv8xa7M2ap4x5ybJRPWZi0BkV91XzVesNKPOiny5MR5uQwadDjZZk+Fdi8MW+6NIghPitSMqeoZj81v+m6ip2aCeVWdeWHbYTQp0Vd5kglTr5iacNC/wAmZcGA117iSFc/FxdOBdBT5dwhcgypq8RCJUoq7yYcH7tO0RzFQedZWc+K7Ucmksii8RbIU7NOzRuWCi9PedVxRqYLHj0QWy9XPzu9vppNOuNI+20426bJKoi8DZoZNKQ60RwUpiO8I5BeYZdEPYFxsTQPhRaaKeSBMFFUYNyTmqieg3KZNrMXDmiKdukzHFKk+80wKbydMW0T7yw0ymxlptpOpsEBPw8vDQkwJrSPRZbRMvtr6wFuX1SHai9C4nWl1SJIztWHCSnOiuJnju9ZNrr4ouj9fmivgbY+Pgg6JVwDvZl3sxNS8TpuXzMC/BQZEZ4bc/8AzY7/ADHGF/iYdFewtG1wGBoDMNlV3k66CPPuF7xumq+ZaWG1zo0OcEq5Zaq42yLRg07kTa0Djnf9lNe/QYixY78p510ERiO2rrxDmTNlAdw9mGTZWrSthkXYtBTLQkXWJCqUVOhdP9/R9+HOfMalTBReXb4bgvSDPoFxQzBHGu1TXVi9RrkLXjUknMFpERQK3yqN8jKvpBFUcnEVTD11/T7Dkq2mpOvwG0U5ECus1ZD0n4m6neDqx9u3ASKfT7TXvT5ALV5OlITC0J9fe1Npv6MGMBkWlRtSl3GQolKdEEUjN9+iZWhRK5RoCYuMKZy2LVc5f9meogch1PlCkha0/uOXNXocXjhdBRmXJlXk/wCrF/NSOrI1VA+JUwTdkghEDZ4qbR9/rFgF5IdqnhfH3SY+K7WucTbH/A1kap2eS2SSLKw+54CVu5EyjeYv9t7KXZhSIkFBRVIlWiCg61JV2UREwF2assB2zsSxB9tWipcgE6O3F1pCRvnesCUoqImatcNOMKJMG0BsKFMiskKE2oU1IORdWAtEc6TL3mB3KveatzdPEEv/AKCo2nDN5AbC4lMjhREj3AfFDlT1RdJUkAnUeEC7Wx6OXS/BNJDdd/Jc5bop1KWKQLpFccWnyDPw8jX/ACX+Wa9mOP216O7cu7Dkq3H+ect4tzRGvNNIpIFzbb3OOgCrxFeOOGLV9QNF7ryxK1zBbuYvhuZXcCKqe5TFwuGZVj8zw0IegYcerbVE6ObrNeJaHFNi7seD+q3Dwv8AoeKeybvarl4bNK5WQy9m4xhXjlZlCn+AsXpqICNxm7jMFgE2CKOlqHgi4Ge0qIjf6eitxqavnSIjcdgU48xzzluuJKqMtvcuTTpivorT3XlEs3ZiS+utXpD7y/1XSP8Afj9PWID/ADDEh4Zw118mAtIWbg74ivwaafbox2+d/9oACAEBAwE/IaCWrf48UQfr3IJXXbaguD06619JHb1LWGULCYLpoaaFTtdBFwA1rkFLCGPIX6qmrzGImJ3OkcTGoqTICRLGASziZHoIUOHffmpDGlddNBg6/NqtDvpRiNv8Knu/pxYNoo7FXnhQXz72nm/WID1ezvyCQkuEaRMZURiDGPIWOPQOjqaYV06jWvPXac0JHeihQQVIoZWjfr2VPc1pICJUsJMMGqSptwekzDrUxtVxnFZa5+/mie5U9vRN3JNCN8rt75wImCgIAVgKzijaox5+96xVgejWY/GMDSxOH7m13BR1xxiLnpRpxVx1tVvzn97b1g7Vp619AeD/AGonI27A91xJE2BU5aXBrwokQ6AT8VTisetqkukic6RO29QDv9U7Lkr7q9DSANNaXEQ9yOjhyGXLQPZh309VxSgeL/VW15Z/ynA0o95eI2oZDsfFLE7uIMTlXAriJir3gBBUctEkbRPaUcgJaBx81DWFGea+igh3xFtKknz90ZoLccVN029AmCUiTKWmAn1+yxRmGO/6qT99SM+BL539B3emgWDnvV/PpGKkj8dfmjSooopj7CmeLUIRI68euL6p6VCty7A1SoIlkGMqKSUAgjTgqIb9TSl8+oxR5WAuqQHKsHmnu3qy2YQ8BIaLanOYeL7BQ9eZLLSEgFOklIVkSOyMEkzOJmbRGq+SKcVsMov55aRqaXjcSn7BCETSrEzWCEwwim0+uHC5G5DIkZs30pnV9P51pmr1B3F01O2drWYSCUmA48XxqvD1UuWhTARMWm75zNXdlkY/ESqEGeWFKthOLoUZQXBTnonG6tUJmUwbIRoQLBWwOML7gPKFsrHjGmNTZP1RBGgLsQDA2KxdLOFlzhSOAJhnZEoxY1DMbJi8xwiYqOMsvK5e77L6KshZRhHRGk6SrpcoZ5WgzQhLRIniHvpFJ8o1akdTZ2gRqPIJzdUzN09iNR1J1FuOjXPmeOs427s9zRNg3pJBzaJEOWkqoTJabEmDQtpR0Mz4ByvhoQErBE7xr59safr/AGfcOYBbIA7I3NK6JwwsmcNeTYKIuwB3e51/nob9MNOfB90462PVwdalGdanW3q6efmv4+WtfH3X/9oACAECAwE/If8Atulf/9oACAEDAwE/If8AsGh7nFGfd9a//9oADAMBAAIRAxEAABAQQAAAAQSAASASCAAAAACQAQAAAAQQQAAACCAAAASAQAQAAQCSQAAACASQCAAQAQAAQCQSAAQQCQACSQCCCCSACQQAQCAAQSAAQAAQSAAQAAQAAADbJKbJbz//2gAIAQEDAT8Qjh3zid73ztVu6ZqAMEooQEHGuKmJmdG3nWaLAbe2NpqX2481cbEQ6bGzTEQnOLqm7xTltHFtvJVpxzpGIiZ7N+daL3xbHn5vyxFKbeVOLRty1ACiiujA7TFBEAYwYqya1YYZEXu7KTuxmtkp2zY0ZqQt01i0CICRQeUTVmP06TyQpbxzS5OQRqwhQEZ0+b7x8bABGOmrYIN86c1LZWE2yVX80IkhBvfRmZ0ioZxft+tE8VI5JjjDe7peiIMCv+XLRiBcTGeiaiUbYHBwMMHIsVNNUVCnhHAKRpJ86u/qTTYi8HiiEjQUhgcxFgokDEybu/HOZm9sOpU43KXTeYalGCS7SxZOS7UE98TD38G3ehAy3TpNlHvnqKEF4xnh/tRATgz2N+KC8m+Os1uIxQ7EHVvaWHo7QJE1hvLLSlSyTkBGsOaSSuwmO/ZoLpYslpCTTE1DVDu8oibrYzaNK5DS5bwN9nK0AAxBPewVcC9wAexBalrL62dt5Fqn3fqkCUodgnJEQcVm8fJQLnEQ/jeSoYrXxDH/AKVYcmsd0LhBN/xUNxgFg3vXWv1eouuaAxeIULSYVh9yAoAKrgAlXWx5qDsdn+sJLGSxBmlC+6hYuS5xMv1NTYh2tdHLZNa6MomYm72sOun7ZFxLExF2Vduv/aDs+Rw10UMa49zOBlpCheAIper5efEIZKOGC1gFZvHyVqYhn8Sr9iLsPsiKe1mLBLcssf7pNO4L8DWQdn9gxRu3wkcAomYsibpXOdBs2MXzDo+0CxiSLBqKFXt3OIY0izHas3j5KN7MAUZiGz81FrY2ExOdUxaI5mkjI5zZ03YlteTNTCSR3JK24onQg8DhUWFSWXTgauLqhVwEh3yQNYABEQntXHiucBImIKCcQDLJVSzLllc6vemSNV+U/VGJyciSUymzW0fH+trY45pgHT8JZhJbBGKTZGEsr2ibbtAXEBm8Ca61tzbainBQMuCJtcpop6+Pr1SnA0oSxjKM81EmpgvvMmfSzAegJ0M5zL6qBJMuURTNnX8XqZTezMmZnOYm+/mtO+ttVhsu17xLSMULk431q8iCTowEb0Q5DMal/wBk0IxGM5ZQ/boIaBe4yaQkKJmMXeefTrram2O71ZyESsSypiIYMBuOzj1Ig7XBhsxxvSLR+rsoDtUs3WDswzeDNaTzEzrOI7c1Mz4tvm+55vU+eTFmhCgIgimUxG1QVFpOj0/5oZmSMgLL3PPQERhorICoqkwa6C2EnSgmwQNEiS6IRCNyL8N1TOjgpfBBmrmVhYK7HSZIVI29L+tdjgbE+K8WSgojCCxYGKRZcn7NTQf1N3mtf7etOPyjMz5MVA+wSF3x7Vm1aZVq3cXXNgkNDCmRzDC1ZKBjTa9DYkkhBKrlDKpdsttqeaXc3Cpvqc3GmqfkebACsA02xwVZJ5kJrVBmFtuNYIhMAMUknKFoGKTre9QCAWIMFQwhCGKMmWKAOAcIGICggaDFBWDrGwVxrwUG96RShBQgJwyIKME4nR3bcGeQax5oBKAkQCUKiZTLl1v7GFzKIqqTrjCJeSkBABD14LgFCWKZ2QINsQBZYudzarEoEjF4jFsIMVJRcxdjHIiyrOnsizsAVjXJQg3teuj2pOO03jVrfw0teDPfb2pEcjokTQQyYrWQAWMF4xQ0Uyf4gJKLcJArKOGFsY5M2iX7d32TF5iNcVDsxltE5J0zir+J+vydcezq+PNm1Qu/96DckYyE216uH7udiEDe4C9NRR4l2TZIZq+0Htn+cYjwi3+057D4U5ous5p8TQ5O/wBNGDsfFfoFP6p8FHV3pod34KM+H4az6cKw8ein/9oACAECAwE/EP8AsDl9xmnHu+/1X//aAAgBAwMBPxD/ALAfr/v/ANKcefR//9k=';
  // imgFarmer: any='/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzN0IzQzdEOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQzN0IzQzdFOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM3QjNDN0I5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDM3QjNDN0M5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAAerAAAMkwAAEGcAABX/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';

  base64ImgData: any;
  imgFileName: any;

  farmerName: any;
  village: any;
  district: any;
  creationDate: any;
  block: any;
  schemeName: any;
  khasraNo: any;
  totalLandArea: any;
  farmCategory: any;
  isSprinkler: any;
  farmPondCategory: any;
  applicationNo: any;

  farmerNameH: any;
  villageH: any;
  districtH: any;
  blockH: any;
  schemeNameH: any;

  farmPondApplicationId: any;
  mobileNo: any;
  caste: any;
  subCaste: any;
  fatherName: any;
  farmerPhoto: any = "";
  obj: any;
  IsChecked: any = "";
  remarks: any = "";

  addFarmPondPreverificationData: any;
  getPlasticCompanyListData: any;
  getPlasticSheetListData: any;
  getThicknessListData: any;
  submitPostVerificationDetail: any = [];
  ChecklistDetailList: any = [];
  BillDetailList: any = [
    {
      BillAmount: "",
      BillImg: "",
      // 'imgUploadBillName':''
    },
  ];

  private ChecklistId: any;
  addRemoveFlag1: boolean = false;
  addRemoveFlag2: boolean = false;
  addRemoveFlag3: boolean = false;
  addRemoveFlag4: boolean = false;

  billType: any;
  private CompanyName: any;

  companyName: any = "";
  sheetMakes: any = "";
  thicknessValue: any = "";
  bisValue: any = "";
  lengthValue: any;
  widthValue: any;
  heightValue: any;
  totalSize: any = 0;
  plusBtn: any = true;
  plusBtnP: any = true;
  billAmount: any;
  billImg: any = "base64";
  ssoID: any;

  imgUploadBillName: any;
  imgJabaBandName: any;
  imgNazariaNakshaName: any;

  imgPatwariApprovedName: any;
  imgFarmerAndOfficerName: any;
  imgPatwariApproved: any = "";
  imgFarmerWithOfficer: any = "";
  // imgPatwariApproved: any = '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzN0IzQzdEOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQzN0IzQzdFOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM3QjNDN0I5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDM3QjNDN0M5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAAerAAAMkwAAEGcAABX/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';
  // imgFarmerWithOfficer: any = '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzN0IzQzdEOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQzN0IzQzdFOUZBNjExRTg4NEZEQjM3MTBCNTNCQjEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDM3QjNDN0I5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDM3QjNDN0M5RkE2MTFFODg0RkRCMzcxMEI1M0JCMTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAAerAAAMkwAAEGcAABX//9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wgARCACBAGwDAREAAhEBAxEB/8QA0AAAAgEFAQEAAAAAAAAAAAAAAAUJAQQGBwgCAwEBAQEBAQAAAAAAAAAAAAAAAAECBAUQAAAFBAEEAgMBAAAAAAAAAAIDBAUGABABByARITEVMEFwQhMUEQABAwICBgUJBQYHAAAAAAACAQMEEQUAEiAhMVFhE0FxgSIUEDAyQlJigiMV8JGxJAZAwXJjgyWiQ1Nzk0R0EgEAAAAAAAAAAAAAAAAAAABwEwEAAQMDAwQDAQEBAQAAAAABEQAhMUFRYfBxgRAgscGRodHhcPEw/9oADAMBAAIRAxEAAAGaAqNR0XAAAFCyEpYFALofDATnKBpIbHXRuQ8ioSnwAcjoTkQpgQAfUkkOqy1EBYnsfDU4vI/AAAGJM+ZCJROfYfjAjEOZgAAAlJOihSJT2ZGXZHQchAAAUJdjbwsEoGRl2caEewAAH3JwS7FYmPBkIwORyOMAAC6Jwj7ioRnkfjQVkOphQAB1qSPnzEgoKDcdn1OLSP0APJNEZoWggLEC5HoxOWyM8qA0Jsy6FYhPAFRma+MDNEnIJvkkfObTsARlkBrc5jOeDDjbxLiRZEqxy0RmG5jfR0EZ2QwlQACSAjeJZiOc1kAAZQYuAAB2icskl5FGegAAAAADPTEDeRz+AAAFlze3WWoFAPNnln6TdQA8oaf/2gAIAQEAAQUCsWCgh5iDRgOnAsPWiw2XOCFsTu+4WwjJ23JWYJDuF/JHGpyxye2e9GBoeOlyw1inNxTNDfIZG4yVwuAYyh68nuX4NDx1owNg+QY7VuR1EUh4pFZ6BUzuRbw1Zo3HbpQMdwYttpTk6W8tVmiNhtGV9l+S7bhbckPXKBtmWmKUZX7l+QW3MoEFr4lGAKNTmBOT0Ov3BnuC24UZhzBxIJEoOKL/AIlUZX2HyXmy5EmckciZTY+88NXRL2iyheDc3KFQc9q3EzFGIb58R1tJaWOh5o0VwZ7gFbbSZeqjd0SQ9crTmFmkZowVC4Fip7nEfYCtdS02ThnGtVLcZUV1+8yemGMscUSRvZZK2TmZoYrusujzNTttZYbS+QvjpaCO/pZRkeA07yNiUzYoZRhW2JH6tkprn8pagt+2UplNsmYXfmtc3GRa2rXGV2IfMHwUhkPD3bz/AJuOpnWpCWQU9rHMtpgWO2Pii7r6V+VG5PUu8owsg3y/fDNv/9oACAECAAEFAvzd/9oACAEDAAEFAvzb9//aAAgBAgIGPwJu/9oACAEDAgY/Am7/2gAIAQEBBj8C/Yil3GWxCjDtekOI2NfZGusz4JVcG3ZYD1xJKokmUqw4td4N0OQ4nWgYVWwtUcfYGGblPideJVwn1CDbpzXTyhdhPU6aGJvN1+HHJiuFEuFKlbpiiD602rHNF5coU93Xw8zLuUwsseGyTzm8qei2G83TVBTiuHJ09wstSSJEQvkQmK91lodlaekW0l0AdaMm3WyQ23GyUHGzHWJgQ0ISTCWe7GKXhltSYkak+psh6aqmxJjQ6yRPTHXv8xa7M2ap4x5ybJRPWZi0BkV91XzVesNKPOiny5MR5uQwadDjZZk+Fdi8MW+6NIghPitSMqeoZj81v+m6ip2aCeVWdeWHbYTQp0Vd5kglTr5iacNC/wAmZcGA117iSFc/FxdOBdBT5dwhcgypq8RCJUoq7yYcH7tO0RzFQedZWc+K7Ucmksii8RbIU7NOzRuWCi9PedVxRqYLHj0QWy9XPzu9vppNOuNI+20426bJKoi8DZoZNKQ60RwUpiO8I5BeYZdEPYFxsTQPhRaaKeSBMFFUYNyTmqieg3KZNrMXDmiKdukzHFKk+80wKbydMW0T7yw0ymxlptpOpsEBPw8vDQkwJrSPRZbRMvtr6wFuX1SHai9C4nWl1SJIztWHCSnOiuJnju9ZNrr4ouj9fmivgbY+Pgg6JVwDvZl3sxNS8TpuXzMC/BQZEZ4bc/8AzY7/ADHGF/iYdFewtG1wGBoDMNlV3k66CPPuF7xumq+ZaWG1zo0OcEq5Zaq42yLRg07kTa0Djnf9lNe/QYixY78p510ERiO2rrxDmTNlAdw9mGTZWrSthkXYtBTLQkXWJCqUVOhdP9/R9+HOfMalTBReXb4bgvSDPoFxQzBHGu1TXVi9RrkLXjUknMFpERQK3yqN8jKvpBFUcnEVTD11/T7Dkq2mpOvwG0U5ECus1ZD0n4m6neDqx9u3ASKfT7TXvT5ALV5OlITC0J9fe1Npv6MGMBkWlRtSl3GQolKdEEUjN9+iZWhRK5RoCYuMKZy2LVc5f9meogch1PlCkha0/uOXNXocXjhdBRmXJlXk/wCrF/NSOrI1VA+JUwTdkghEDZ4qbR9/rFgF5IdqnhfH3SY+K7WucTbH/A1kap2eS2SSLKw+54CVu5EyjeYv9t7KXZhSIkFBRVIlWiCg61JV2UREwF2assB2zsSxB9tWipcgE6O3F1pCRvnesCUoqImatcNOMKJMG0BsKFMiskKE2oU1IORdWAtEc6TL3mB3KveatzdPEEv/AKCo2nDN5AbC4lMjhREj3AfFDlT1RdJUkAnUeEC7Wx6OXS/BNJDdd/Jc5bop1KWKQLpFccWnyDPw8jX/ACX+Wa9mOP216O7cu7Dkq3H+ect4tzRGvNNIpIFzbb3OOgCrxFeOOGLV9QNF7ryxK1zBbuYvhuZXcCKqe5TFwuGZVj8zw0IegYcerbVE6ObrNeJaHFNi7seD+q3Dwv8AoeKeybvarl4bNK5WQy9m4xhXjlZlCn+AsXpqICNxm7jMFgE2CKOlqHgi4Ge0qIjf6eitxqavnSIjcdgU48xzzluuJKqMtvcuTTpivorT3XlEs3ZiS+utXpD7y/1XSP8Afj9PWID/ADDEh4Zw118mAtIWbg74ivwaafbox2+d/9oACAEBAwE/IaCWrf48UQfr3IJXXbaguD06619JHb1LWGULCYLpoaaFTtdBFwA1rkFLCGPIX6qmrzGImJ3OkcTGoqTICRLGASziZHoIUOHffmpDGlddNBg6/NqtDvpRiNv8Knu/pxYNoo7FXnhQXz72nm/WID1ezvyCQkuEaRMZURiDGPIWOPQOjqaYV06jWvPXac0JHeihQQVIoZWjfr2VPc1pICJUsJMMGqSptwekzDrUxtVxnFZa5+/mie5U9vRN3JNCN8rt75wImCgIAVgKzijaox5+96xVgejWY/GMDSxOH7m13BR1xxiLnpRpxVx1tVvzn97b1g7Vp619AeD/AGonI27A91xJE2BU5aXBrwokQ6AT8VTisetqkukic6RO29QDv9U7Lkr7q9DSANNaXEQ9yOjhyGXLQPZh309VxSgeL/VW15Z/ynA0o95eI2oZDsfFLE7uIMTlXAriJir3gBBUctEkbRPaUcgJaBx81DWFGea+igh3xFtKknz90ZoLccVN029AmCUiTKWmAn1+yxRmGO/6qT99SM+BL539B3emgWDnvV/PpGKkj8dfmjSooopj7CmeLUIRI68euL6p6VCty7A1SoIlkGMqKSUAgjTgqIb9TSl8+oxR5WAuqQHKsHmnu3qy2YQ8BIaLanOYeL7BQ9eZLLSEgFOklIVkSOyMEkzOJmbRGq+SKcVsMov55aRqaXjcSn7BCETSrEzWCEwwim0+uHC5G5DIkZs30pnV9P51pmr1B3F01O2drWYSCUmA48XxqvD1UuWhTARMWm75zNXdlkY/ESqEGeWFKthOLoUZQXBTnonG6tUJmUwbIRoQLBWwOML7gPKFsrHjGmNTZP1RBGgLsQDA2KxdLOFlzhSOAJhnZEoxY1DMbJi8xwiYqOMsvK5e77L6KshZRhHRGk6SrpcoZ5WgzQhLRIniHvpFJ8o1akdTZ2gRqPIJzdUzN09iNR1J1FuOjXPmeOs427s9zRNg3pJBzaJEOWkqoTJabEmDQtpR0Mz4ByvhoQErBE7xr59safr/AGfcOYBbIA7I3NK6JwwsmcNeTYKIuwB3e51/nob9MNOfB90462PVwdalGdanW3q6efmv4+WtfH3X/9oACAECAwE/If8Atulf/9oACAEDAwE/If8AsGh7nFGfd9a//9oADAMBAAIRAxEAABAQQAAAAQSAASASCAAAAACQAQAAAAQQQAAACCAAAASAQAQAAQCSQAAACASQCAAQAQAAQCQSAAQQCQACSQCCCCSACQQAQCAAQSAAQAAQSAAQAAQAAADbJKbJbz//2gAIAQEDAT8Qjh3zid73ztVu6ZqAMEooQEHGuKmJmdG3nWaLAbe2NpqX2481cbEQ6bGzTEQnOLqm7xTltHFtvJVpxzpGIiZ7N+daL3xbHn5vyxFKbeVOLRty1ACiiujA7TFBEAYwYqya1YYZEXu7KTuxmtkp2zY0ZqQt01i0CICRQeUTVmP06TyQpbxzS5OQRqwhQEZ0+b7x8bABGOmrYIN86c1LZWE2yVX80IkhBvfRmZ0ioZxft+tE8VI5JjjDe7peiIMCv+XLRiBcTGeiaiUbYHBwMMHIsVNNUVCnhHAKRpJ86u/qTTYi8HiiEjQUhgcxFgokDEybu/HOZm9sOpU43KXTeYalGCS7SxZOS7UE98TD38G3ehAy3TpNlHvnqKEF4xnh/tRATgz2N+KC8m+Os1uIxQ7EHVvaWHo7QJE1hvLLSlSyTkBGsOaSSuwmO/ZoLpYslpCTTE1DVDu8oibrYzaNK5DS5bwN9nK0AAxBPewVcC9wAexBalrL62dt5Fqn3fqkCUodgnJEQcVm8fJQLnEQ/jeSoYrXxDH/AKVYcmsd0LhBN/xUNxgFg3vXWv1eouuaAxeIULSYVh9yAoAKrgAlXWx5qDsdn+sJLGSxBmlC+6hYuS5xMv1NTYh2tdHLZNa6MomYm72sOun7ZFxLExF2Vduv/aDs+Rw10UMa49zOBlpCheAIper5efEIZKOGC1gFZvHyVqYhn8Sr9iLsPsiKe1mLBLcssf7pNO4L8DWQdn9gxRu3wkcAomYsibpXOdBs2MXzDo+0CxiSLBqKFXt3OIY0izHas3j5KN7MAUZiGz81FrY2ExOdUxaI5mkjI5zZ03YlteTNTCSR3JK24onQg8DhUWFSWXTgauLqhVwEh3yQNYABEQntXHiucBImIKCcQDLJVSzLllc6vemSNV+U/VGJyciSUymzW0fH+trY45pgHT8JZhJbBGKTZGEsr2ibbtAXEBm8Ca61tzbainBQMuCJtcpop6+Pr1SnA0oSxjKM81EmpgvvMmfSzAegJ0M5zL6qBJMuURTNnX8XqZTezMmZnOYm+/mtO+ttVhsu17xLSMULk431q8iCTowEb0Q5DMal/wBk0IxGM5ZQ/boIaBe4yaQkKJmMXeefTrram2O71ZyESsSypiIYMBuOzj1Ig7XBhsxxvSLR+rsoDtUs3WDswzeDNaTzEzrOI7c1Mz4tvm+55vU+eTFmhCgIgimUxG1QVFpOj0/5oZmSMgLL3PPQERhorICoqkwa6C2EnSgmwQNEiS6IRCNyL8N1TOjgpfBBmrmVhYK7HSZIVI29L+tdjgbE+K8WSgojCCxYGKRZcn7NTQf1N3mtf7etOPyjMz5MVA+wSF3x7Vm1aZVq3cXXNgkNDCmRzDC1ZKBjTa9DYkkhBKrlDKpdsttqeaXc3Cpvqc3GmqfkebACsA02xwVZJ5kJrVBmFtuNYIhMAMUknKFoGKTre9QCAWIMFQwhCGKMmWKAOAcIGICggaDFBWDrGwVxrwUG96RShBQgJwyIKME4nR3bcGeQax5oBKAkQCUKiZTLl1v7GFzKIqqTrjCJeSkBABD14LgFCWKZ2QINsQBZYudzarEoEjF4jFsIMVJRcxdjHIiyrOnsizsAVjXJQg3teuj2pOO03jVrfw0teDPfb2pEcjokTQQyYrWQAWMF4xQ0Uyf4gJKLcJArKOGFsY5M2iX7d32TF5iNcVDsxltE5J0zir+J+vydcezq+PNm1Qu/96DckYyE216uH7udiEDe4C9NRR4l2TZIZq+0Htn+cYjwi3+057D4U5ous5p8TQ5O/wBNGDsfFfoFP6p8FHV3pod34KM+H4az6cKw8ein/9oACAECAwE/EP8AsDl9xmnHu+/1X//aAAgBAwMBPxD/ALAfr/v/ANKcefR//9k=';

  latitude: any = "";
  longitude: any = "";
  roleId: any;
  userid: any;
  flag: boolean = false;
  saveBill: boolean = true;
  objConfirm: any;
  getPostVeficationDetailsByAppIdData: any = [];
  getPostVeficationDetailsByAppIdChecklistData: any = [];
  getPostVeficationDetailsByAppIdBillData: any = [];
  getConfirmPostVerificationData: any = [];
  getPostVeficationDetailsByAppIdComponentData: any = [];
  farmerNameHnd: any;
  displayImage: any;
  applicationId: any;
  subsidySchemeId: any;

  /*New*/
  segmentSelected = "work";
  farmerChoice: any = "yes";
  selectedUploadBills: any;
  checkListClose = false;
  dimensionsClose = false;
  photoUploadClose = false;
  hactarePSClose = false;

  toggleCheckList() {
    this.checkListClose = !this.checkListClose;
  }

  toggleDimensions() {
    this.dimensionsClose = !this.dimensionsClose;
  }

  togglePhotoUpload() {
    this.photoUploadClose = !this.photoUploadClose;
  }
  toggleHectarePS() {
    this.hactarePSClose = !this.hactarePSClose;
  }
  getPreVerificationData: any = [];
  khashraNumber: any;
  createdChecklist: any = [];
  billArray: any = [];
  totalAmountOfBill: number = 0;
  lengthOfFarmPond: number = 0;
  widthOfFarmPond: number = 0;
  depthOfFarmPond: number = 0;
  totalDimensionsOfFarmPond: number = 0;
  lat: any;
  lng: any;
  farmerPreviousGrant: any;
  photoFarmerWithOfficer: any;
  photoAffidavit: any;
  photoAffidavitDateTime: any;

  photoKhasaraCertificate: any;
  photoFarmerWithOfficerDateTime: any;
  photoKhasaraCertificateDateTime: any;
  photoFarmerApprovalCertificate: any;
  photoFarmerApprovalCertificateDateTime: any;
  upcomingFlag: any;
  thicknessId: any;
  bisID: any;

  selectedMeansOfIrrigation: any;
  selectedMeansOfIrrigationHi: any;
  meansOfIrrigationList: any = [];

  selectedMicroIrrigationSystem: any;
  selectedMicroIrrigationSystemHi: any;
  microIrrigationSystemList: any = [];

  listOfWaterTankType: any = [];
  listOfSheetThickness: any = [];
  listOfBIS: any = [];

  listOfISIMarks: any = [];
  /*getPostVeficationDetailsByAppIdComponentData=[
        {
            "PostVerifHortiSprinklerID":"1",
            "ComponentId":"41",
            "StandardQuantity":"41",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"HDPE Pipes with Quick Coupled (2.5 kg/cm2  IS:14151 Part II, 90mm diameter & 6m long)",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"41"
        },
        {
            "PostVerifHortiSprinklerID":"2",
            "ComponentId":"42",
            "StandardQuantity":"11",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Quick Coupled HDPE 90mm Foot batten Assembly",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"11"
        },
        {
            "PostVerifHortiSprinklerID":"3",
            "ComponentId":"43",
            "StandardQuantity":"11",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"GI Riser Pipe 3/4 diameter x 75 cm long",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"11"
        },
        {
            "PostVerifHortiSprinklerID":"4",
            "ComponentId":"44",
            "StandardQuantity":"11",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Sprinkler Nozzles (1.7 to2.8 kg/cm2):IS 12232 part I Brass",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"11"
        },
        {
            "PostVerifHortiSprinklerID":"5",
            "ComponentId":"45",
            "StandardQuantity":"2",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Quick Coupled HDPE Bend with Coupler 90o  (90mm)",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"2"
        },
        {
            "PostVerifHortiSprinklerID":"6",
            "ComponentId":"46",
            "StandardQuantity":"1",
            "EstimatedQty":"22",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Quick Coupled HDPE Pump Connecting Nipple  90mm",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"1"
        },
        {
            "PostVerifHortiSprinklerID":"7",
            "ComponentId":"47",
            "StandardQuantity":"2",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Quick Coupled HDPE End Plug 90mm",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"2"
        },
        {
            "PostVerifHortiSprinklerID":"8",
            "ComponentId":"48",
            "StandardQuantity":"1",
            "EstimatedQty":"2",
            "InstalledQty":"2.00",
            "ISI_MarkID":"IS-14151 (Part-II): 2008 ",
            "BatchNo":"2",
            "CML_NoID":"3197666",
            "ComponentName":"Quick Coupled HDPE Tee with Coupler 90mm",
            "CouplerId":"3",
            "Ha":"3.0",
            "HaValue":"1"
        }
    ]*/

  jamabandiImages: any = [];
  constructor(
    private sanitizer: DomSanitizer,
    private fileOpener: FileOpener,
    private downloader: Downloader,
    public navCtrl: NavController,
    public storage: Storage,
    private route: ActivatedRoute,
    private photoViewer: PhotoViewer,
    public httpClient: CommonService,
    public alertCtrl: AlertController
  ) {
    console.log("ionViewDidLoad PostVerificationShowDetailsConfirmationPage");
    this.applicationId = this.route.snapshot.paramMap.get(
      "FarmPondApplicationId"
    );
    this.subsidySchemeId = this.route.snapshot.paramMap.get("SubsidySchemeId");
    this.upcomingFlag = this.route.snapshot.paramMap.get("flag");
    this.getPostVeficationDetailsByAppId(
      this.applicationId,
      this.subsidySchemeId
    );

    this.ssoID = this.httpClient.userData.SSO_ID;
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;

    if (this.subsidySchemeId == 4 || this.subsidySchemeId == 6) {
      this.getMicroIrrigationSystem();
      this.getListOfMeansofIrrigation();
    }

    if (this.subsidySchemeId == 6) {
      this.getListOfWaterTankType();
    }

    if (this.subsidySchemeId == 3) {
      this.getISILIST();
    }

    if (this.subsidySchemeId == 1 || this.subsidySchemeId == 4) {
      this.getSheetThickness();
      this.getBisList();
    }
  }
  /*getHorticultureManufactureListData() {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GetHorticultureManufactureList",
                srvparam: "{}",
            },
        };
        console.log("HorticultureManufactureList - ", sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log(" HorticultureManufactureList res", res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    self.getHorticultureManufactureData = res[0].data;
                } else {
                    self.showPrompt(res[0].data);
                }
            },
            (error) => {
                // self.httpClient.dismissLoading();
                self.httpClient.showToastError();
            }
        );
    }
    getHorticultureManufactureDealerList(manufacturerId, protoTypeId) {
        var self = this;
        // self.dealerValue = "";
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GetHorticultureManufactureDealerList",
                srvparam:
                    "{'HorticultureManufactureId':'" +
                    manufacturerId +
                    "','ProductTypeId':'" +
                    protoTypeId +
                    "'}",
            },
        };
        console.log("GetHorticultureManufactureDealerList - ", sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log(" GetHorticultureManufactureDealerList res", res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    self.getHorticultureManufactureDealerListData = res[0].data;
                } else {
                    self.showPrompt(res[0].data);
                                            self.getHorticultureManufactureDealerListData='';

                }
            },
            (error) => {
                // self.httpClient.dismissLoading();
                self.httpClient.showToastError();
            }
        );
    }*/
  getISILIST() {
    var self = this;
    // self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetISIMarkList",
        srvparam: "{'SubsidySchemeId':'3'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        // self.httpClient.dismissLoading();
        if (res[0].status == 0) {
          self.listOfISIMarks = res[0].data;
        } else {
          // self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.(res[0].message);
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetISIMarkList",
            srvparam: "{'SubsidySchemeId':'3'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  getListOfMeansofIrrigation() {
    var self = this;
    // self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetMeansofIrrigation",
        srvparam: "{'AgriLovValuesCode':'MeansofIrrigation'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.meansOfIrrigationList = res[0].data;
        } else {
          self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.(res[0].message);
        // self.httpClient.dismissLoading();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetMeansofIrrigation",
            srvparam: "{'AgriLovValuesCode':'MeansofIrrigation'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  getMicroIrrigationSystem() {
    var self = this;
    // self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetMicroIrrigationSystem",
        srvparam: "{'AgriLovValuesCode':'MicroIrrigationAvailableInApp'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.microIrrigationSystemList = res[0].data;
          // for(var i=0;i<self.microIrrigationSystemList.length;i++){
          //     if(self.getPostVeficationDetailsByAppIdData.MicroIrrigationId==self.microIrrigationSystemList[i].AgriLovValuesId)
          //     {
          //         self.selectedMicroIrrigationSystem=self.microIrrigationSystemList[i].AgriLovEn;
          //         self.selectedMicroIrrigationSystemHi=self.microIrrigationSystemList[i].AgriLovHi;
          //     }
          // }
        } else {
          self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.(res[0].message);
        // self.httpClient.dismissLoading();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetMicroIrrigationSystem",
            srvparam: "{'AgriLovValuesCode':'MicroIrrigationAvailableInApp'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  getListOfWaterTankType() {
    var self = this;
    // self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetWaterStorageTypeLov",
        srvparam: "{'AgriLovValuesCode':'ShapeWaterTank'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.listOfWaterTankType = res[0].data;
        } else {
          self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.(res[0].message);
        // self.httpClient.dismissLoading();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetWaterStorageTypeLov",
            srvparam: "{'AgriLovValuesCode':'ShapeWaterTank'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  getBisList() {
    var self = this;
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetThicknessAndBISCodeList",
        srvparam: JSON.stringify({
          Flag: "0",
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];

        if (res.status == 0) {
          self.httpClient.dismissLoading();

          self.listOfBIS = res.data;
          console.log("listOfBIS- > ", self.listOfBIS);
        } else {
          self.httpClient.dismissLoading();

          if (res.data == "") {
            self.httpClient.showToast(res.message);
          } else {
            self.httpClient.showToast(res.data);
          }
        }
      },
      (error) => {
        self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetThicknessAndBISCodeList",
            srvparam: JSON.stringify({
              Flag: "0",
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getSheetThickness() {
    var self = this;
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "GetThicknessAndBISCodeList",
        srvparam: JSON.stringify({
          Flag: "1",
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];

        if (res.status == 0) {
          self.httpClient.dismissLoading();

          self.listOfSheetThickness = res.data;
          console.log("listOfSheetThickness- > ", self.listOfSheetThickness);
        } else {
          self.httpClient.dismissLoading();

          if (res.data == "") {
            self.httpClient.showToast(res.message);
          } else {
            self.httpClient.showToast(res.data);
          }
        }
      },
      (error) => {
        self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetThicknessAndBISCodeList",
            srvparam: JSON.stringify({
              Flag: "1",
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  ionViewWillEnter() {
    console.log("ionViewDidLoad PostVerificationShowDetailsConfirmationPage");
  }

  getImage(item) {
    return this.sanitizer.bypassSecurityTrustUrl(item);
  }
  getPostVeficationDetailsByAppId(applicationId, subsidySchemeId) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "PostVerification",
        srvmethodnm: "GetPostVeficationDetailsByAppId",
        srvparam: JSON.stringify({
          ApplicationId: applicationId,
          SubsidySchemeId: subsidySchemeId,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        // console.log("res", JSON.parse(res));
        if (res[0].status == 0) {
          self.outerDataOfPipeline=res[0].data;
          self.getPostVeficationDetailsByAppIdData = res[0].data[0];
          self.imgJamabandi = self.getPostVeficationDetailsByAppIdData.ImgJamabandi.split(",");
          console.log("self.imgJamabandi", self.imgJamabandi);
          self.bisID = self.getPostVeficationDetailsByAppIdData.BISNO;
          self.thicknessId = self.getPostVeficationDetailsByAppIdData.ThickNess;
          console.log("self.bisID", self.bisID);
          console.log("self.thicknessId", self.thicknessId);

          self.getPostVeficationDetailsByAppIdComponentData =
            res[0].ComponentData;
          self.getPostVeficationDetailsByAppIdChecklistData =
            res[0].checklistdata;
          self.getPostVeficationDetailsByAppIdBillData = res[0].billdata;
          for (
            var i = 0;
            i < self.getPostVeficationDetailsByAppIdBillData.length;
            i++
          ) {
            self.totalAmountOfBill =
              self.totalAmountOfBill +
              parseInt(
                self.getPostVeficationDetailsByAppIdBillData[i].BillAmount
              );
          }

          // if (self.subsidySchemeId == 1) {
            if (self.getPostVeficationDetailsByAppIdData.JamabandiDocuments != "" &&  self.getPostVeficationDetailsByAppIdData.JamabandiDocuments != undefined ) {
              var tempJamaBandi = self.getPostVeficationDetailsByAppIdData.JamabandiDocuments.split(",");
              // for()
              console.log("tempJamaBandi", tempJamaBandi);
              for (var ani = 0; ani < tempJamaBandi.length; ani++) {
                var innerJamaBandi = tempJamaBandi[ani].split("$");
                // var innerJamaBandi={data:tempJamaBandi[ani],status:tempJamaBandi[ani+1]};
                console.log("innerJamaBandi", innerJamaBandi)
                self.jamabandiImages.push({ status: innerJamaBandi[0], data: innerJamaBandi[1] });
              }
            }
          // }



        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoadingImage();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "GetPostVeficationDetailsByAppId",
            srvparam: JSON.stringify({
              ApplicationId: applicationId,
              SubsidySchemeId: subsidySchemeId,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == "hindi") {
      const prompt = await this.alertCtrl.create({
        header: "अलर्ट!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "ठीक है",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "OK",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  onClickFirstAddRemove() {
    this.addRemoveFlag1 = !this.addRemoveFlag1;
    if (!this.addRemoveFlag1) {
      this.firstView = false;
    } else {
      this.firstView = true;
    }
  }

  onClickSecondAddRemove() {
    this.addRemoveFlag2 = !this.addRemoveFlag2;
    if (!this.addRemoveFlag2) {
      this.secondView = false;
      this.saveBill = false;
    } else {
      this.secondView = true;
      this.saveBill = true;
    }
  }

  onClickThirdAddRemove() {
    this.addRemoveFlag3 = !this.addRemoveFlag3;
    if (!this.addRemoveFlag3) {
      this.thirdView = false;
    } else {
      this.thirdView = true;
    }
  }

  onClickFourthAddRemove() {
    this.addRemoveFlag4 = !this.addRemoveFlag4;
    if (!this.addRemoveFlag4) {
      this.fourthView = false;
    } else {
      this.fourthView = true;
    }
  }

  showImg(img) {
    window.open(img, "_system");
  }

  confirmPostVerification() {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "PostVerification",
        srvmethodnm: "ConfirmPostVerification",
        srvparam: JSON.stringify({
          ApplicationId: this.applicationId,
          SubsidySchemeId: this.subsidySchemeId,
          UserId: this.userid,
          RoleId: this.roleId,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getConfirmPostVerificationData = res[0].data;
          console.log(
            "getConfirmPostVerificationData",
            self.getConfirmPostVerificationData
          );
          // self.navCtrl.popTo('DashboardPage');
          // self.navCtrl.navigateBack(['dashboard']);
          self.navCtrl.pop();
        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoading();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "ConfirmPostVerification",
            srvparam: JSON.stringify({
              ApplicationId: this.applicationId,
              SubsidySchemeId: this.subsidySchemeId,
              UserId: this.userid,
              RoleId: this.roleId,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getExtensionJama() {
    // var fileName = this.getPostVeficationDetailsByAppIdData.ImgJamabandi;
    // var fileName = this.url;

    var fileName = this.getPostVeficationDetailsByAppIdData.imgJamabandi;
    // var fileName = this.url;

    var extension = fileName.split(".").pop();

    console.log(extension, extension === "jpg", "png");
    window.open(fileName, "_system");
  }
  getExtensionJama2(fileName) {
    // var fileName = this.getPostVeficationDetailsByAppIdData.ImgJamabandi;
    // var fileName = this.url;

    var extension = fileName.split(".").pop();

    console.log(extension, extension === "jpg", "png");
    window.open(fileName, "_system");
  }

  getExtensionNazaria() {
    var fileName = this.getPostVeficationDetailsByAppIdData.ImgNazariaNaksha;
    // var fileName = this.url;

    var extension = fileName.split(".").pop();

    console.log(extension, extension === "jpg", "png");
    window.open(fileName, "_system");
  }

  showImageDom(img) {
    console.log("showImageDom clicked", img);

    this.photoViewer.show(img);
    // this.displayImage = this.sanitizer.bypassSecurityTrustUrl( img);
    // window.open(this.displayImage, '_system');
  }
  revertBackToAS() {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "RevertPostPVAAO_To_AS",
        srvparam: JSON.stringify({
          ApplicationId: this.applicationId,
          SubsidySchemeId: this.subsidySchemeId,
          userid: this.userid,
          Remarks: "",
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          // self.getConfirmPostVerificationData = res[0].data;
          // console.log(
          //   "getConfirmPostVerificationData",
          //   self.getConfirmPostVerificationData
          // );
          // self.navCtrl.popTo('DashboardPage');
          // self.navCtrl.navigateBack(['dashboard']);
          self.navCtrl.pop();
        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoading();
      },
      (error) => {
        // self.httpClient.dismissLoading();
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PostVerification",
            srvmethodnm: "RevertPostPVAAO_To_AS",
            srvparam: JSON.stringify({
              ApplicationId: this.applicationId,
              SubsidySchemeId: this.subsidySchemeId,
              userid: this.userid,
              Remarks: "",
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
}
