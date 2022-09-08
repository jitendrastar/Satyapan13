import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { BehaviorSubject, Observable } from "rxjs";
import { CommonService } from './common.service';

@Injectable({
    providedIn: "root",
})
export class DatabaseServiceService {
    public storage: SQLiteObject;

    constructor(
        private sqlite: SQLite,
        private platform: Platform,
        public httpClient: CommonService
    ) {
        this.platform.ready().then(() => {
            if (!this.platform.is("mobileweb")) {
              


                this.sqlite
                    .create({
                        name: "verification.db",
                        location: "default",
                    })
                    .then((db: SQLiteObject) => {
                        this.storage = db;
                        this.storage
                        .executeSql(
                            "create table if not exists dashboard(SubsidySchemeId CHAR(10) PRIMARY KEY, SubsidySchemeHi CHAR(100), SubsidySchemeEn CHAR(100), DashboardImg CHAR(99999))",
                            []
                        )
                        .then(() => console.log("Executed SQL dashboard"))
                        .catch((error) => {
                            console.log("Error in table creation", error);
                        });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfMicroSprinkler(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfMiniSprinkler(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfSprinkler(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfDrip(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfFarmImplement(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists mobileVerification(mobileNumber CHAR(999999999))", []).then(() =>
                            console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });

                        this.storage
                            .executeSql(
                                "create table if not exists preVerificationOfflineWaterTank(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(99999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists preVerificationOfflineDiggi(ApplicationId CHAR(10) PRIMARY KEY,applicationSubmissionData CHAR(99999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists preVerificationOfflineFormPond(ApplicationId CHAR(10) PRIMARY KEY,applicationSubmissionData CHAR(99999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists preVerificationOfflinePipeline(ApplicationId CHAR(10) PRIMARY KEY,applicationSubmissionData CHAR(999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage.executeSql("create table if not exists postVerificationOfflineOfFarmpond(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999))",
                            []
                        )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });

                        //
                        this.storage
                            .executeSql(
                                "create table if not exists postVpipelineIrrigationAllData(ApplicationId CHAR(10) PRIMARY KEY, applicationData CHAR(999999999999999999999999999999999999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists postVerificationOfflineOfDiggi(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists postVerificationOfflineOfWaterTank(ApplicationId CHAR(10) PRIMARY KEY,applicationData CHAR(999999999999999999999999999999999999999999999999999999999999))",
                                []
                            )
                            .then(() => console.log("Executed SQL"))
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });

                        // this.storage.executeSql('create table if not exists postVerificationOfPipelineGetPipelineType(PipelineTypeId INTEGER PRIMARY KEY,PipelineTypeEn CHAR(100), PipelineTypeHi CHAR(100))', [])
                        //   .then(() => console.log('Executed SQL'))
                        //   .catch((error) => {
                        //     console.log("Error in table creation", error);
                        //   });
                        // this.storage.executeSql('create table if not exists postVerificationOfPipelineCompanyBrandType(CompanyBrandId INTEGER PRIMARY KEY,CompanyBrandNameEn CHAR(100), CompanyBrandNameHi CHAR(100))', [])
                        //   .then(() => console.log('Executed SQL'))
                        //   .catch((error) => {
                        //     console.log("Error in table creation", error);
                        //   });

                        this.storage
                            .executeSql(
                                "create table if not exists pVerificationPIPipelineType(PipelineTypeId CHAR(10) PRIMARY KEY, PipelineTypeEn CHAR(500), PipelineTypeHi CHAR(500))",
                                []
                            )
                            .then(() => {
                                this.getMsatersOfPostVPI();
                            })
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                                this.getMsatersOfPostVPI();
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists pVerificationPICompanyBrand(CompanyBrandId CHAR(10) PRIMARY KEY, CompanyBrandNameHi CHAR(500), CompanyBrandNameEn CHAR(500))",
                                []
                            )
                            .then(() => {
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists pVerificationPICMLdata(CMLMasterId CHAR(10) PRIMARY KEY, CMLNo CHAR(500),CompanyBrandId CHAR(500))",
                                []
                            )
                            .then(() => {
                            })
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                        this.storage
                            .executeSql(
                                "create table if not exists pVerificationBISnumberdata(Id CHAR(10) PRIMARY KEY, BISNoEn CHAR(500),BISNoHi CHAR(500))",
                                []
                            )
                            .then(() => {
                            })
                            .catch((error) => {
                                // console.log("Error in table creation", error);
                            });
                    })
                    .catch((e) => console.log(e));
            }
        });
    }

    addMobileNumber(mobileNumber) {
        console.log("mobileNumber", mobileNumber);
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [mobileNumber];
            return this.storage
                .executeSql(
                    "INSERT INTO mobileVerification (mobileNumber) VALUES (?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    // console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addpreVerificationOfflineWaterTank(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [ApplicationId, applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO preVerificationOfflineWaterTank (ApplicationId,applicationData ) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addpreVerificationOfflineDiggi(ApplicationId, submissionData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [ApplicationId, submissionData];
            return this.storage
                .executeSql(
                    "INSERT INTO preVerificationOfflineDiggi (ApplicationId,applicationSubmissionData ) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    // console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    getMsatersOfPostVPI() {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GetPostverificationMasterData",
                srvparam: "{'Flag':'0'}",
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                if (res[0].status == 0) {
                    self.insertPipelineTypeDataOffline(res[0]);
                } else {
                }
                self.httpClient.dismissLoadingImage();
            },
            (error) => {
            }
        );
    }

    insertBISnumberdataOffline(pipelineTypeData) {
        if (!this.platform.is("mobileweb")) {
            var temp = pipelineTypeData.PIPEBISNO;
            for (let i = 0; i < temp.length; i++) {
                let dataToInsert = [temp[i].Id, temp[i].BISNoEn, temp[i].BISNoHi];
                this.storage
                    .executeSql(
                        "INSERT INTO pVerificationBISnumberdata ( Id, BISNoEn, BISNoHi) VALUES (?, ?, ?)",
                        dataToInsert
                    )
                    .then((val) => {

                    })
                    .catch((error) => {
                        // console.log("error", error);
                    });
            }
        }
    }

    insertCMLDataOffline(pipelineTypeData) {
        if (!this.platform.is("mobileweb")) {
            var temp = pipelineTypeData.CMLData;
            for (let i = 0; i < temp.length; i++) {
                let dataToInsert = [
                    temp[i].CMLMasterId,
                    temp[i].CMLNo,
                    temp[i].CompanyBrandId,
                ];
                this.storage
                    .executeSql(
                        "INSERT INTO pVerificationPICMLdata ( CMLMasterId, CMLNo, CompanyBrandId) VALUES (?, ?, ?)",
                        dataToInsert
                    )
                    .then((val) => {
                        // console.log("CML data inserted", i);
                    })
                    .catch((error) => {
                        // console.log("error", error);
                    });
            }
        }
        this.insertBISnumberdataOffline(pipelineTypeData);
    }

    insertBrandCompanyDataOffline(pipelineTypeData) {
        if (!this.platform.is("mobileweb")) {
            var temp = pipelineTypeData.PipelineBrands;
            for (let i = 0; i < temp.length; i++) {
                let dataToInsert = [
                    temp[i].CompanyBrandId,
                    temp[i].CompanyBrandNameHi,
                    temp[i].CompanyBrandNameEn,
                ];
                this.storage
                    .executeSql(
                        "INSERT INTO pVerificationPICompanyBrand ( CompanyBrandId, CompanyBrandNameHi, CompanyBrandNameEn) VALUES (?, ?, ?)",
                        dataToInsert
                    )
                    .then((val) => {
                    })
                    .catch((error) => {
                        // console.log("error", error);
                    });
            }
        }

        this.insertCMLDataOffline(pipelineTypeData);
    }

    insertPipelineTypeDataOffline(pipelineTypeData: any) {
        if (!this.platform.is("mobileweb")) {
            var temp = pipelineTypeData.PIPELINETYPE;
            for (let i = 0; i < temp.length; i++) {
                let dataToInsert = [
                    temp[i].PipelineTypeId,
                    temp[i].PipelineTypeEn,
                    temp[i].PipelineTypeHi,
                ];
                this.storage
                    .executeSql(
                        "INSERT INTO pVerificationPIPipelineType ( PipelineTypeId, PipelineTypeEn, PipelineTypeHi) VALUES (?, ?, ?)",
                        dataToInsert
                    )
                    .then((val) => {

                    })
                    .catch((error) => {
                        // console.log("error", error);
                    });
            }
        }
        this.insertBrandCompanyDataOffline(pipelineTypeData);
    }

    addpreVerificationOfflinePipeline(ApplicationId, submissionData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [ApplicationId, submissionData];
            return this.storage
                .executeSql(
                    "INSERT INTO preVerificationOfflinePipeline (ApplicationId,applicationSubmissionData ) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    // console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addpreVerificationOffline(ApplicationId, submissionData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [ApplicationId, submissionData];
            return this.storage
                .executeSql(
                    "INSERT INTO preVerificationOfflineFormPond (ApplicationId,applicationSubmissionData ) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    // console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addpostVerificationOfDiggi(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfDiggi ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }
    addpostVerificationOfFarmImplement(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData
            ];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfFarmImplement ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }
    // postVerificationOfflineOfFarmImplement
    addpostVerificationOfWaterTank(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfWaterTank ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addpostVerificationOfFarmPondOffline(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData
            ];
            //  CHAR(10) PRIMARY KEY,
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfFarmpond ( ApplicationId, applicationData) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    addSubsidyScheme(
        SubsidySchemeId,
        SubsidySchemeHi,
        SubsidySchemeEn,
        DashboardImg
    ) {


        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                SubsidySchemeId,
                SubsidySchemeHi,
                SubsidySchemeEn,
                DashboardImg,
            ];
            return this.storage
                .executeSql(
                    "INSERT INTO dashboard (SubsidySchemeId, SubsidySchemeHi, SubsidySchemeEn, DashboardImg) VALUES (?, ?, ?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val dashboard", val);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        }
    }

    addPostVpipelineIrrigationAllData(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData,
            ];
            return this.storage
                .executeSql(
                    "INSERT INTO postVpipelineIrrigationAllData (ApplicationId, applicationData) VALUES (?, ?)",
                    dataToInsert
                )
                .then((val) => {
                    console.log("val", val);
                })
                .catch((error) => {
                    // console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
    }

    emptyStorage(): void {
        this.platform.ready().then(() => {
            if (!this.platform.is("mobileweb")) {
                this.storage.executeSql("DROP TABLE IF EXISTS dashboard"),
                    (data) => {
                        console.log("deleted", data); // never gets printed
                    },
                    (error) => {
                        console.log("error deleted", error.err); // never gets printed
                    };
            }
        });
    }

    // postVerificationOfflineOfDrip
    addpostVerificationOfflineOfDrip(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfDrip ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    this.httpClient.showToast('This application is saved for Offline');
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    // postVerificationOfflineOfMiniSprinkler
    addpostVerificationOfflineOfMiniSprinkler(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfMiniSprinkler ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    this.httpClient.showToast('This application is saved for Offline');
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    // postVerificationOfflineOfMicroSprinkler
    addpostVerificationOfflineOfMicroSprinkler(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfMicroSprinkler ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    this.httpClient.showToast('This application is saved for Offline');
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }

    // postVerificationOfflineOfSprinkler
    addPostVerificationOfflineOfSprinkler(ApplicationId, applicationData) {
        if (!this.platform.is("mobileweb")) {
            let dataToInsert = [
                ApplicationId,
                applicationData];
            return this.storage
                .executeSql(
                    "INSERT INTO postVerificationOfflineOfSprinkler ( ApplicationId, applicationData) VALUES (?, ?)", dataToInsert)
                .then((val) => {
                    console.log('This application is saved for Offline  RS Sprinkler');
                    this.httpClient.showToast('This application is saved for Offline');
                })
                .catch((error) => {
                    console.log("error", error);
                    this.httpClient.showToast("This data is already saved for offline");
                });
        }
        // }
    }
}
