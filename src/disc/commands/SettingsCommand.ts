import { Command } from "./Command";
import {Channel, DMChannel, Interaction, MessageActionRow, MessageButton, MessageEmbed, User} from "discord.js";
import { Client as Asana } from "asana";
import { Hersana } from "../../Hersana";
import {MessageUtils} from "../../utils/MessageUtils";
import Logger from "../../utils/Logger";

export class SettingsCommand extends Command {

    constructor() {
        super("settings", "Manage Hersana's Settings!");

        this.render()
            .addSubcommand(sc => sc
                .setName("link")
                .setDescription("Link your Asana account to Hersana!")
                .addStringOption(o => o
                    .setName("token")
                    .setDescription("Your Asana account token.")
                    .setRequired(false)
                )
            )
            .addSubcommand(sc => sc
                .setName("channel")
                .setDescription("Set your Guild's task automation channel!")
                .addChannelOption(o => o
                    .setName("channel")
                    .setDescription("The channel you want task automation to be read from.")
                    .setRequired(true)
                )
            )
    }

    execute(interaction: Interaction, userData?: any): any {
        let user = interaction.user;

        // For some reason WebStorm makes you check if the interaction is a command before allowing autocomplete functions.
        if(interaction.isCommand()) {
            switch (interaction.options.getSubcommand()) {
                case "link":

                    let asanaToken: any = interaction.options.getString("token");

                    if (asanaToken === null) {
                        // Send Message In Command Channel -> DM User Directions -> Collect Token (/settings link <token>)

                        user.createDM().then((channel: DMChannel) => {
                            channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor("#bb24d2")
                                    .setTitle("Hersana • Settings • Link")
                                    .setFooter({text: "© 2022 Meturum Solutions LLC"})
                                    .setDescription(MessageUtils.EMOJIFY("parrow") + "Due to the small scale of Hersana, We use PATs (Personal Access Tokens) to authenticate your Asana account. **DO NOT SHARE YOUR PAT!!!** \n\n" + MessageUtils.EMOJIFY("parrow") + " To create your PAT, [Click Here](https://app.asana.com/0/my-apps). Once on the webpage, Click \"Create new token\" and enter \"Hersana Automation\" in the pop-up input field & Agree to [Asana's API TOS](https://asana.com/terms#api-terms)." +
                                        " Once completed, submit by clicking \"Create token\". Asana will prompt you to copy your token. (*You will not be able to copy this token later!*) Copy the token onto your clipboard and navigate back to Discord.\n\n" + MessageUtils.EMOJIFY("parrow") + "Now, in **Direct Messages** execute the command `/settings link` and paste your token.\n\n **Congratulations, you have now linked your Asana account to Hersana!**")
                                ]
                            }).then(() => {
                                interaction.reply({
                                    embeds: [new MessageEmbed()
                                        .setColor("#bb24d2")
                                        .setTitle("Hersana • Settings • Link")
                                        .setFooter({text: "© 2022 Meturum Solutions LLC"})
                                        .setDescription(MessageUtils.EMOJIFY("parrow") + " Directions on linking your Asana account has been sent to your Direct Messages.\n\n*Please note that when linking your Asana account, the command **MUST** be executed in Direct Messages!*")
                                    ]
                                }).then();
                            })
                        }).catch(() => {
                            interaction.reply({
                                embeds: [
                                    Command.generateErrorEmbed("<:rarrow:734880402673762387> Whoops! It seems that I cannot Direct Message you. To link your Asana account to Hersana it is **REQUIRED** to have Direct Messages enabled.")
                                ]
                            }).then()
                        })
                    } else {
                        // Verify the token actually works.
                        let client: Asana = Asana.create().useAccessToken(asanaToken);

                        client.users.me().then(async (results: any) => {
                            let newData: any = { };
                            if(await Hersana.getInstance().keyv.has(user.id)) {
                                newData = await Hersana.getInstance().keyv.get(user.id);
                            }

                            newData["asana"] = asanaToken;

                            if(results.workspaces.length > 1) {
                                let buttons = [];

                                for(let i = 0; i < results.workspaces.length; i++) {
                                    let ws = results.workspaces[i];

                                    let iN = this.actionCache.submit(() => {

                                    });

                                    buttons.push(new MessageButton()
                                        .setCustomId(this.name+"-"+iN)
                                        .setLabel(ws.name)
                                        .setStyle("PRIMARY")
                                    )
                                }

                                return await interaction.reply({ content: "Please select a workspace for your task to created in.", components: [ new MessageActionRow()
                                        .addComponents(...buttons)] })
                            }

                            newData["workspace"] = results.workspaces[0];

                            await Hersana.getInstance().keyv.set(user.id, newData)
                        }).catch(async () => {
                            await interaction.reply({
                                embeds: [
                                    Command.generateErrorEmbed(MessageUtils.EMOJIFY("rarrow") + "Unable to link your Asana account.\n\n*Having Issues? Contact a Project Contributor @ contact@ijyrs.com*")
                                ]
                            })
                        })
                    }

                    break;
                case "channel":

                    // TODO: Enhance this.
                    if (interaction.guild?.ownerId === user.id || user.id === Hersana.CONSTANTS.DEVELOPER_SNOWFLAKE) {
                        let channel = interaction.options.getChannel("channel");

                       if(channel !== undefined) {
                           Hersana.getInstance().keyv.set("tcs", [
                               channel?.id
                           ]).then(() => {
                               interaction.reply("Ok :)").then()
                           })
                       }
                    }else {
                        interaction.reply("No :(").then()
                    }

                    break;
            }
        }
    }

}