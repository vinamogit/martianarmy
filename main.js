

var HOLDERS = (
    async () => {

        var data = {};
        var isxamount = 0;
        var driftamount = 0;

        function display (holder) {
            var display = `<h3>#${holder.position} <img src="https://id.lobstr.co/${holder.account}.png" width="16px"/> ${holder.account}</h3>`; //"#" + holder.position + " " + holder.account + "<br />";
            display += `<div id="pool">`;
            display += `Pool<br />`;
            display += parseFloat(holder.pct).toFixed(3) + "%<br />";
            display += `${new Intl.NumberFormat().format(isxamount * holder.pct / 100)} <img src="${data.isx.toml_info.image}" width="24px" style="vertical-align: text-bottom;" />`
            display += `<img src="${data.drift.toml_info.image}" width="24px" style="vertical-align: text-bottom;" /> ` + new Intl.NumberFormat().format(driftamount * holder.pct / 100) + "<br />";
            display += `<br />Estimated Reward<br />`;
            display += `${new Intl.NumberFormat().format(holder.reward.isx)} <img src="${data.isx.toml_info.image}" width="24px" style="vertical-align: text-bottom;" />`
            display += `<img src="${data.drift.toml_info.image}" width="24px" style="vertical-align: text-bottom;" />  ${new Intl.NumberFormat().format(holder.reward.drift)}`;
            display += `</div>`;
            document.getElementById("list").innerHTML = display;
        } 

        var response = await fetch("https://isx.interstellar-nft.com/martianarmy/holders")
        var data = await response.json();

        console.log(data)

        var isxamount = parseInt(data.isx.amount)/10000000;
        var driftamount = parseInt(data.drift.amount)/10000000;
        var isxreward = parseInt(isxamount * 500000 / driftamount);
        var header = `Liquidity Pool<br />`;
        header += `${new Intl.NumberFormat().format(parseInt(isxamount))} ISX<img src="${data.isx.toml_info.image}" width="48px" style="vertical-align: middle;" /><img src="${data.drift.toml_info.image}" width="48px" style="vertical-align: middle;" />DRIFT ${new Intl.NumberFormat().format(parseInt(driftamount))}<br />`
        header += `<br />Estimated Weekly Reward<br />`;
        header += `${new Intl.NumberFormat().format(isxreward)} ISX<img src="${data.isx.toml_info.image}" width="32px" style="vertical-align: middle;" /><img src="${data.drift.toml_info.image}" width="32px" style="vertical-align: middle;" />DRIFT ${new Intl.NumberFormat().format(500000)}<br />`
        header += `APY: ${(parseFloat(data.apy) * 100).toFixed(2)}% | APR: ${(parseFloat(data.apr) * 100).toFixed(2)}%`
        document.getElementById("lp").innerHTML = header;

        var labels = [];
        var graph = [];
        for (var holder of data.holders) {
            labels.push(holder.position)
            graph.push(holder.pct)
        }

        
        Chart.defaults.color = "#141416";
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '% of ISX <> DRIFT',
                    data: graph,
                    hoverBorderColor: 'green',
                    hoverBackgroundColor: 'green',
                    backgroundColor: [
                        '#272742',
                    ],
                    borderColor: [
                        
                        '#272742',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        type: 'logarithmic',
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false
                    }
                },
                events: ["click"],
                onClick: function (e, item) {
                    if (item.length) {
                        // console.log(item[0].element)
                        var index = item[0].element.$context.parsed.x;
                        var holder = data.holders[index];
                        display(holder)
                    }
                }
            }
        });

        document.getElementById("submitPubKey").addEventListener("click", function (e) {
            var account = document.getElementById("publicKey").value;
            for (var holder of data.holders) {
                if (holder.account == account) {
                    var index = parseInt(holder.position) - 1;
                    myChart.setActiveElements([
                        {
                          datasetIndex: 0,
                          index: index,
                        },
                      ]);
                    myChart.update();
                    display(holder)
                }
            }
        })

    }
)()

