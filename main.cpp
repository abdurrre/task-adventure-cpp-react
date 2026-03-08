#include "include/crow_all.h"
#include <iostream>
#include <string>

using namespace std;

// DEKLARASI KONSTANTA & VARIABEL GLOBAL ASLI
const int n = 128;
string appName = "taskAdventure";
string userName = "0";

string todoList[n];
int todoListReward[n];
bool todoListIsItDone[n];

string rewardList[n];
int rewardListPrice[n];

int coinBalance = 0;
int todoListCount = 0;
int rewardListCount = 0;
int undoneTodoCount = 0;

// FUNGSI SORTING ASLI
void sortTodoList(){
    for(int i=0; i<todoListCount-1; i++){
        for(int j=0; j<todoListCount-i-1; j++){
            if(todoListReward[j]<todoListReward[j+1]){
                int tempInt = todoListReward[j];
                todoListReward[j] = todoListReward[j+1];
                todoListReward[j+1] = tempInt;
                
                string tempString = todoList[j];
                todoList[j] = todoList[j+1];
                todoList[j+1] = tempString;
                
                bool tempBool = todoListIsItDone[j];
                todoListIsItDone[j] = todoListIsItDone[j+1];
                todoListIsItDone[j+1] = tempBool;
            }
        }
    }
}

void sortRewardList(){
    for(int i=0; i<rewardListCount-1; i++){
        for(int j=0; j<rewardListCount-i-1; j++){
            if(rewardListPrice[j]<rewardListPrice[j+1]){
                int tempInt = rewardListPrice[j];
                rewardListPrice[j] = rewardListPrice[j+1];
                rewardListPrice[j+1] = tempInt;
                
                string tempString = rewardList[j];
                rewardList[j] = rewardList[j+1];
                rewardList[j+1] = tempString;
            }
        }
    }
}

int main() {
    crow::SimpleApp app;

    // API: DASHBOARD
    CROW_ROUTE(app, "/api/dashboard")([&](){
        sortTodoList();
        sortRewardList();
        
        crow::json::wvalue x;
        x["userName"] = userName;
        x["coinBalance"] = coinBalance;
        x["undoneCount"] = undoneTodoCount;
        
        x["todos"] = crow::json::wvalue::list();
        for(int i=0; i<todoListCount; i++){
            x["todos"][i]["name"] = todoList[i];
            x["todos"][i]["reward"] = todoListReward[i];
            x["todos"][i]["done"] = todoListIsItDone[i];
        }

        x["rewards"] = crow::json::wvalue::list();
        for(int i=0; i<rewardListCount; i++){
            x["rewards"][i]["name"] = rewardList[i];
            x["rewards"][i]["price"] = rewardListPrice[i];
        }
        
        crow::response res(x);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 1: TAMBAH TO-DO
    CROW_ROUTE(app, "/api/add-todo").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        todoList[todoListCount] = body["task"].s();
        todoListReward[todoListCount] = body["reward"].i();
        todoListIsItDone[todoListCount] = false;
        todoListCount++;
        undoneTodoCount++;
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 2: HAPUS TO-DO
    CROW_ROUTE(app, "/api/delete-todo").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        int index = body["index"].i();
        
        todoListIsItDone[index] = false;
        for(int i=index; i<todoListCount-1; i++){
            todoList[i] = todoList[i+1];
            todoListReward[i] = todoListReward[i+1];
            todoListIsItDone[i] = todoListIsItDone[i+1];
        }
        todoListCount--;
        undoneTodoCount--;
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 3: CEKLIS TO-DO
    CROW_ROUTE(app, "/api/done-todo").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        int index = body["index"].i();
        
        if(todoListIsItDone[index] == false){
            todoListIsItDone[index] = true;
            coinBalance += todoListReward[index];
            undoneTodoCount--;  
        }
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 4: UNCEKLIS TO-DO
    CROW_ROUTE(app, "/api/undone-todo").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        int index = body["index"].i();
        
        if(todoListIsItDone[index] == true){
            todoListIsItDone[index] = false;
            coinBalance -= todoListReward[index];
            undoneTodoCount++;  
        }
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 5: TAMBAH SELF REWARD
    CROW_ROUTE(app, "/api/add-reward").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        rewardList[rewardListCount] = body["name"].s();
        rewardListPrice[rewardListCount] = body["price"].i();
        rewardListCount++;
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // API 6: HAPUS SELF REWARD
    CROW_ROUTE(app, "/api/delete-reward").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        int index = body["index"].i();
        
        for(int i=index; i<rewardListCount-1; i++){
            rewardList[i] = rewardList[i+1];
            rewardListPrice[i] = rewardListPrice[i+1];
        }
        rewardListCount--;
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    //  API 7: BELI SELF REWARD
    CROW_ROUTE(app, "/api/buy-reward").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        int index = body["index"].i();
        
        if((coinBalance - rewardListPrice[index]) >= 0){
            coinBalance -= rewardListPrice[index];
            crow::response res(200);
            res.add_header("Access-Control-Allow-Origin", "*");
            return res;
        } else {
            crow::response res(400, "Saldo koin tidak cukup");
            res.add_header("Access-Control-Allow-Origin", "*");
            return res;
        }
    });

    // API 8: GANTI USERNAME
    CROW_ROUTE(app, "/api/change-username").methods("POST"_method)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        userName = body["username"].s();
        
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // PENYELAMAT CORS (MENGATASI ERROR SAAT TOMBOL DIKLIK)
    CROW_CATCHALL_ROUTE(app)([](const crow::request& req) {
        crow::response res(200);
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        return res;
    });

    cout << "------------------------------------------\n";
    cout << "Task Adventure Backend Ready pada Port 8080\n";
    cout << "------------------------------------------\n";
    app.port(8080).multithreaded().run();
}