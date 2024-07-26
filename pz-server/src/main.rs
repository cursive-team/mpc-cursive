#[macro_use]
extern crate rocket;

use pz_web::{
    i_hiring::{init, server_compute, server_setup, ClientEncryptedData},
    FheBool,
};
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct ComputeRequest {
    jc_0_fhe: ClientEncryptedData,
    jc_1_fhe: ClientEncryptedData,
    seed: u64,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct ComputeResponse {
    result: FheBool,
}

#[post("/compute", format = "json", data = "<compute_data>")]
fn compute(compute_data: Json<ComputeRequest>) -> Json<ComputeResponse> {
    println!("{}", compute_data.seed);
    init(compute_data.seed);
    server_setup(compute_data.jc_0_fhe.clone(), compute_data.jc_1_fhe.clone());
    Json(ComputeResponse {
        result: server_compute(compute_data.jc_0_fhe.clone(), compute_data.jc_1_fhe.clone()),
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![compute])
}
