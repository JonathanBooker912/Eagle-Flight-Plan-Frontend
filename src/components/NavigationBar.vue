<script>
//import { onMounted, ref } from "vue";
//import { useRouter } from "vue-router";
//import { useModalStore } from "../store/modal.store";
//import { storeToRefs } from "pinia";
//import Utils from "../config/utils";

import 'primeicons/primeicons.css';


export default {
    setup() {
      //  const router = useRouter();
      //  const curUser = ref(null);

        const showDashboard = () => {
            //router.push({name: 'dashboard'});
            let x = document.getElementsByClassName('active');              // Find nav bar active item
            x.classList.remove('active');                                   // Remove the actve CSS class
            document.getElementById('dash').classList.add('active');
        }

        const showFlightPlan = () => {
            //router.push({name: 'flightPlan'});
            let x = document.getElementsByClassName('active');              // Find nav bar active item
            x.classList.remove('active');                                   // Remove the actve CSS class
            document.getElementById('flightPlan').classList.add('active');
        }

        const showCalendar = () => {
            //router.push({name: 'calendar'});
            let x = document.getElementsByClassName('navOption');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('calendar').classList.add('active');
        }

        const showNotifs = () => {
            //router.push({name: 'notifs'});
            let x = document.getElementsByClassName('active');              // Find nav bar active item
            x.classList.remove('active');                                   // Remove the actve CSS class
            document.getElementById('notifs').classList.add('active');
        }

        const showSearch = () => {
            //router.push({name: 'search'});
            let x = document.getElementsByClassName('active');              // Find nav bar active item
            x.classList.remove('active');                                   // Remove the actve CSS class
            document.getElementById('search').classList.add('active');
        }

    return {
      showDashboard,
      showFlightPlan,
      showCalendar,
      showNotifs,
      showSearch

    };
  },
};
</script>

<template>
  <v-card class="infoSidebar">

    <div id="dash" class="userSection dash" @click="showDashboard()"> 
        <i class="pi pi-th-large"></i>
        Dashboard
    </div>
    <div id="flightPlan" class="navOption flightPlan" @click="showFlightPlan()">
        <i class="pi pi-telegram"></i>
        Flight Plan
    </div>
    <div id="calendar" class="navOption calendar" @click="showCalendar()">
        <i class="pi pi-calendar"></i>
        Calendar
    </div>
    <div id="notifications" class="navOption notifs"  @click="showNotifications()">
        <i class="pi pi-bell"></i>
        Notifications
    </div>
    <div id="search" class="navOption search" @click="showSearch()">
        <i class="pi pi-search"></i>
        Search
    </div>
</v-card>
</template>

<style>

.pi {

    padding-left: 5px;
    padding-right: 5px;
    font-weight: 700;

}

.active {
    background-color: #eee !important;
    color: #262626 !important;
}
.infoSidebar {
    width: 20%;
    height: 100%;
}

.navOption {
    height: 60px;
    width: 100%;

    padding-left: 15px;
    align-content: center;

    font-size: 18px;
    font-weight: 700;
}
</style>
