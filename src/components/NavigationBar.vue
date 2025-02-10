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
  <div class="userNav">

    <div id="dash" class="navOption dash" @click="showDashboard()"> 
        <i class="pi pi-th-large"></i>
        <p>Dashboard</p>
    </div>
    <div id="flightPlan" class="navOption flightPlan" @click="showFlightPlan()">
        <i class="pi pi-telegram"></i>
        <p>Flight Plan</p>
    </div>
    <div id="calendar" class="navOption calendar" @click="showCalendar()">
        <i class="pi pi-calendar"></i>
        <p>Calendar</p>
    </div>
    <div id="notifs" class="navOption notifs" @click="showNotifs()">
        <i class="pi pi-bell"></i>
        <p>Notifications</p>
    </div>
    <div id="search" class="navOption search" @click="showSearch()">
        <i class="pi pi-search"></i>
        <p>Search</p>
    </div>
  </div>
</template>

<style>

.userNav {
    width: 60px; /* Default collapsed width */
    height: 100%;
    margin: 1% 0% 1% 1%;
    border-radius: 25px;
    background-color: #ddd;
    transition: width .5s;
}

.userNav:hover {
    width: 250px; /* Expanded width */
}

.navOption {
    display: flex;
    align-items: center;
    padding: 10px;
    white-space: nowrap; /* Prevents text wrapping */
}

.navOption p {
    opacity: 0;
    transition: opacity 0.5s;
}

.infoSidebar:hover .navOption p {
    opacity: 1;
}


.pi {
    padding-left: 5px;
    font-weight: 700;
    font-size: 30px;
    margin: 5px 15px 10px 0px;

}

.active {
    background-color: #eee !important;
    color: #262626 !important;
}


</style>
