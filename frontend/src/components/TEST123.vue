<template>
    <div>
        <h1>TEST123</h1>
        <h3>
            <!-- <v-btn @click="HelloWorld">go home</v-btn> -->
        </h3>       
        <table>
            <colgroup>
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:30%">
                <col style="width:25%">
                <col style="width:15%">
            </colgroup>
            <thead>
                <tr>
                    <th style="background: #efefef;">Action ID</th>
                    <th style="background: #efefef;">Block ID</th>
                    <th style="background: #efefef;">Transaction ID</th>
                    <th style="background: #efefef;">Timestamp</th>
                    <th style="background: #efefef;">Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in transactions">
                    <td>{{transaction[0]}}</td>
                    <td>{{transaction[1]}}</td>
                    <td>{{transaction[2]}}</td>
                    <td>{{transaction[3]}}</td>
                    <td>{{transaction[4]}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'TEST123',
    data() {
        return {
            transactions: []
        }
    },
    created() {
        this.$http.post('/api/getActions', {
            account: 'hiya11111111'
        })
        .then((response) => {
            console.log("111111 :: " + JSON.stringify(response))
            var result = response.data
            if (result.result === "OK") {
                this.transactions = result.rows
            } else {
                this.transactions = []
                alert(result.message)
            }
        })
    }
}
</script>